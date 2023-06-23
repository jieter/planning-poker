import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.sessions import SessionMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

django_asgi_app = get_asgi_application()

import app.poker.routing  # noqa

router = SessionMiddlewareStack(URLRouter(app.poker.routing.websocket_urlpatterns))
application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": router,
    }
)
