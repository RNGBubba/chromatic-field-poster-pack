from pathlib import Path

ROOT = Path(__file__).parent


def test_pack_has_four_original_print_modes_and_export_controls():
    sketch = (ROOT / "sketch.js").read_text()
    index = (ROOT / "index.html").read_text()
    assert "Lattice Bloom" in sketch
    assert "Signal Orchard" in sketch
    assert "Tidal Glyph" in sketch
    assert "Night Geometry" in sketch
    assert "saveCanvas" in sketch
    assert "modeSelect" in index


def test_pack_documents_print_size_and_original_license():
    price = (ROOT / "PRICE.md").read_text()
    readme = (ROOT / "README.md").read_text()
    assert "300 DPI" in price
    assert "US$18" in price
    assert "original" in readme.lower()


def test_pack_has_no_external_image_assets_or_secrets():
    names = {path.name for path in ROOT.rglob("*") if path.is_file()}
    assert not any(name.endswith((".png", ".jpg", ".jpeg")) for name in names)
    combined = "\n".join(
        path.read_text(errors="ignore")
        for path in ROOT.rglob("*")
        if path.is_file() and path.suffix in {".html", ".js", ".md", ".css"}
    )
    for forbidden in ("gho_", "sk-", "AKIA"):
        assert forbidden not in combined
