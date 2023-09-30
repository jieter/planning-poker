"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 4.0.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""
import os
from pathlib import Path


def env(key, default=None):
    return os.environ.get(key, default)


IS_PRODUCTION = "PRODUCTION" in os.environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = env("SECRET_KEY", "django-insecure-94=1j=n6rby0fglmw_%@#_n8oe65+q=flh8hd%lf8!qm%4cjhz")

DEBUG = not IS_PRODUCTION

ALLOWED_HOSTS = []
if RENDER_EXTERNAL_HOSTNAME := env("RENDER_EXTERNAL_HOSTNAME"):
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
if HOSTNAME := env("HOSTNAME"):
    ALLOWED_HOSTS.append(HOSTNAME)

INSTALLED_APPS = [
    "daphne",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    "app.poker",
    "channels",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

ROOT_URLCONF = "app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "app.wsgi.application"
ASGI_APPLICATION = "app.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "static/"
STATICFILES_DIRS = ["assets/"]
if IS_PRODUCTION:
    STATIC_ROOT = BASE_DIR / "staticfiles"
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(env("REDIS_HOST", "127.0.0.1"), 6379)],
        },
    },
}

SESSION_COOKIE_HTTPONLY = False
