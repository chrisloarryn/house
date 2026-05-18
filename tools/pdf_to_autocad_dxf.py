#!/usr/bin/env python3
from __future__ import annotations

import argparse
import math
import shutil
import subprocess
from pathlib import Path

import cv2
import ezdxf
import numpy as np


PX_TO_MM_AT_200_DPI = 25.4 / 200.0


def ensure_png(pdf_path: Path, png_path: Path) -> None:
    if png_path.exists():
        return
    png_path.parent.mkdir(parents=True, exist_ok=True)
    stem = png_path.with_suffix("")
    subprocess.run(
        ["pdftocairo", "-png", "-singlefile", "-r", "200", str(pdf_path), str(stem)],
        check=True,
    )


def px_to_cad(point: tuple[int, int], image_height: int, scale: float) -> tuple[float, float]:
    x, y = point
    return x * scale, (image_height - y) * scale


def add_layers(doc: ezdxf.EzDXF) -> None:
    layers = {
        "PDF_UNDERLAY": 8,
        "TRACE_WALLS_AND_LINES": 7,
        "TRACE_FINE_DETAIL": 8,
        "TRACE_ORANGE_MARKUPS": 30,
        "SHEET_BORDER": 2,
    }
    for name, color in layers.items():
        if name not in doc.layers:
            doc.layers.add(name, color=color)


def dark_line_mask(bgr: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    saturation = hsv[:, :, 1]
    mask = ((gray < 205) & (saturation < 105)).astype(np.uint8) * 255
    mask = cv2.medianBlur(mask, 3)
    return mask


def orange_mask(bgr: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    lower = np.array([5, 45, 90])
    upper = np.array([35, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    return cv2.medianBlur(mask, 3)


def add_hough_lines(
    msp: ezdxf.layouts.Modelspace,
    mask: np.ndarray,
    layer: str,
    image_height: int,
    scale: float,
    min_length_px: int,
    color: int | None = None,
) -> int:
    edges = cv2.Canny(mask, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(
        edges,
        rho=1,
        theta=np.pi / 180,
        threshold=42,
        minLineLength=min_length_px,
        maxLineGap=9,
    )
    if lines is None:
        return 0

    seen: set[tuple[int, int, int, int]] = set()
    count = 0
    for x1, y1, x2, y2 in lines[:, 0]:
        length = math.hypot(x2 - x1, y2 - y1)
        if length < min_length_px:
            continue
        key = tuple(round(v / 2) for v in (x1, y1, x2, y2))
        rev = (key[2], key[3], key[0], key[1])
        if key in seen or rev in seen:
            continue
        seen.add(key)
        attrs = {"layer": layer}
        if color is not None:
            attrs["color"] = color
        msp.add_line(
            px_to_cad((int(x1), int(y1)), image_height, scale),
            px_to_cad((int(x2), int(y2)), image_height, scale),
            dxfattribs=attrs,
        )
        count += 1
    return count


def add_contours(
    msp: ezdxf.layouts.Modelspace,
    mask: np.ndarray,
    layer: str,
    image_height: int,
    scale: float,
    min_area: float,
    max_area: float,
    color: int | None = None,
) -> int:
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    count = 0
    for contour in contours:
        area = cv2.contourArea(contour)
        if area < min_area or area > max_area:
            continue
        perimeter = cv2.arcLength(contour, True)
        if perimeter < 28:
            continue
        approx = cv2.approxPolyDP(contour, epsilon=max(0.75, perimeter * 0.004), closed=True)
        pts = [px_to_cad((int(p[0][0]), int(p[0][1])), image_height, scale) for p in approx]
        if len(pts) < 2:
            continue
        attrs = {"layer": layer}
        if color is not None:
            attrs["color"] = color
        msp.add_lwpolyline(pts, close=True, dxfattribs=attrs)
        count += 1
    return count


def add_reference_image(
    doc: ezdxf.EzDXF,
    msp: ezdxf.layouts.Modelspace,
    image_path: Path,
    image_width_px: int,
    image_height_px: int,
    scale: float,
) -> None:
    image_def = doc.add_image_def(
        filename=str(image_path.name),
        size_in_pixel=(image_width_px, image_height_px),
    )
    msp.add_image(
        image_def,
        insert=(0, 0),
        size_in_units=(image_width_px * scale, image_height_px * scale),
        dxfattribs={"layer": "PDF_UNDERLAY"},
    )


def build_dxf(pdf_path: Path, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    png_path = output_dir / "plano_laurel_ref.png"
    ensure_png(pdf_path, png_path)

    bgr = cv2.imread(str(png_path), cv2.IMREAD_COLOR)
    if bgr is None:
        raise RuntimeError(f"Could not read {png_path}")

    image_height, image_width = bgr.shape[:2]
    scale = PX_TO_MM_AT_200_DPI
    dxf_path = output_dir / "plano_laurel_autocad.dxf"

    doc = ezdxf.new("R2010")
    doc.units = ezdxf.units.MM
    add_layers(doc)
    msp = doc.modelspace()

    add_reference_image(doc, msp, png_path, image_width, image_height, scale)
    dark = dark_line_mask(bgr)
    orange = orange_mask(bgr)

    # Keep long linework as editable AutoCAD LINE entities and add contour
    # polylines for curves, symbols, title-block detail, and hatch remnants.
    line_count = add_hough_lines(
        msp, dark, "TRACE_WALLS_AND_LINES", image_height, scale, min_length_px=35
    )
    fine_count = add_contours(
        msp, dark, "TRACE_FINE_DETAIL", image_height, scale, min_area=18, max_area=9000
    )
    orange_count = add_contours(
        msp, orange, "TRACE_ORANGE_MARKUPS", image_height, scale, min_area=12, max_area=7000, color=30
    )

    width_mm = image_width * scale
    height_mm = image_height * scale
    msp.add_lwpolyline(
        [(0, 0), (width_mm, 0), (width_mm, height_mm), (0, height_mm)],
        close=True,
        dxfattribs={"layer": "SHEET_BORDER"},
    )

    doc.header["$INSUNITS"] = 4
    doc.header["$LUNITS"] = 2
    doc.header["$EXTMIN"] = (0, 0, 0)
    doc.header["$EXTMAX"] = (width_mm, height_mm, 0)
    doc.saveas(dxf_path)

    readme = output_dir / "plano_laurel_autocad_README.txt"
    readme.write_text(
        "\n".join(
            [
                "AutoCAD conversion generated from a raster PDF.",
                "",
                f"Source PDF: {pdf_path}",
                f"DXF: {dxf_path.name}",
                f"Referenced image: {png_path.name}",
                "",
                "Units: millimeters on the original printed sheet at 200 dpi.",
                f"Sheet size in CAD: {width_mm:.2f} mm x {height_mm:.2f} mm.",
                "",
                "Layers:",
                "- PDF_UNDERLAY: referenced PNG extracted from the PDF.",
                "- TRACE_WALLS_AND_LINES: Hough-detected editable linework.",
                "- TRACE_FINE_DETAIL: simplified contour polylines for symbols/text/curves.",
                "- TRACE_ORANGE_MARKUPS: orange section/elevation annotations.",
                "- SHEET_BORDER: generated outer sheet frame.",
                "",
                "Because the PDF contains only a JPEG image, this is an automatic trace, not",
                "a recovered native architectural model. Use the underlay for visual checking",
                "and clean critical dimensions manually in AutoCAD.",
                "",
                f"Detected entities: {line_count} straight lines, {fine_count} fine contours, {orange_count} orange contours.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    # Keep a sibling copy with a name that is friendlier in AutoCAD file dialogs.
    shutil.copy2(dxf_path, output_dir / "plano_laurel_autocad_trazado.dxf")
    return dxf_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--out-dir", type=Path, required=True)
    args = parser.parse_args()
    dxf_path = build_dxf(args.pdf.resolve(), args.out_dir.resolve())
    print(dxf_path)


if __name__ == "__main__":
    main()
