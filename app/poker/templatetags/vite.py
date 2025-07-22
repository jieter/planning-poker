import json

from django import template
from django.conf import settings
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe

"""Very minimal version of https://github.com/MrBin99/django-vite"""
VITE_MANIFEST = settings.BASE_DIR / "assets/manifest.json"
VITE_URL = "http://localhost:5174"

register = template.Library()


def script_tag(src, **attributes):
    attributes.setdefault("type", "module")
    attributes["src"] = src
    attrs_html = format_html_join(" ", '{}="{}"', attributes.items())
    return mark_safe(f"<script {attrs_html}></script>")


@register.simple_tag
def vite_hmr() -> str:
    """Render a script tag to load the Vite HMR development client, or nothing if nog in DEBUG."""
    if settings.DEBUG:
        return script_tag(f"{VITE_URL}/@vite/client")
    else:
        return ""


@register.simple_tag
def vite(entry: str, **kwargs) -> str:
    """Render a script tag to load an entry file."""
    if settings.DEBUG:
        return script_tag(f"{VITE_URL}/{entry}", **kwargs)
    else:
        manifest = json.loads(VITE_MANIFEST.read_text())

        url = f"{settings.STATIC_URL}{manifest[entry]['file']}"
        return script_tag(url, **kwargs)
