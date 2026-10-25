# Build the JavaScript bundle
FROM node:26-slim AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.14-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PRODUCTION=1 \
    DATABASE_PATH=/data/db.sqlite3
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY --from=assets /app/assets/ assets/
RUN ./manage.py collectstatic --noinput

RUN useradd --system app && mkdir /data && chown app /data
USER app
VOLUME /data
EXPOSE 8000

# Note: docker sets HOSTNAME to the container id, override it with the public hostname.
CMD ["sh", "-c", "./manage.py migrate --noinput && exec daphne -b 0.0.0.0 -p 8000 --proxy-headers --access-log - app.asgi:application"]
