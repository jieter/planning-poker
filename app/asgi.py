import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.sessions import SessionMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

import app.poker.routing

router = SessionMiddlewareStack(URLRouter(app.poker.routing.websocket_urlpatterns))
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": router,
        # "websocket": AllowedHostsOriginValidator(router),
    }
)
