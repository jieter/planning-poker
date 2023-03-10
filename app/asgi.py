import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

import app.poker.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

router = URLRouter(app.poker.routing.websocket_urlpatterns)
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": router,
        # "websocket": AllowedHostsOriginValidator(router),
    }
)
