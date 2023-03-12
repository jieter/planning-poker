# Planning poker based on django-channels

1. Create a virtual envirionment
1. Install the requirements: `pip install -r requirements.txt`
1. Apply the migrations: `./manage.py migrate`
1. Start a Redis server for backing storage: `docker run -p 6379:6379 -d redis:5`
1. Compile the JavaScript files: `npm run dev`
1. Run the server: `./manage.py runserver`
1. Navigate to http://localhost:8000/ to start a new session

# Running on render.com (free tier)

1. Configure a database, wait until it is ready and copy the "Internal Database URL"
1. Create a web service from this repository
 - Build command: `./build.sh`
 - Start command: `daphne -b 0.0.0.0 app.asgi:application`
 - Environment variable: `DATABASE_URL` (value from "Internal Database URL")
 - Environment variable: `PYTHON_VERSION` `3.11.2`
