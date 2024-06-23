# Install python and JS dependencies, run migrations, collectstatic and restart supervisor

source ~/virtualenv/bin/activate
cd ~/planning-poker
git pull
npm ci
npm install @rollup/rollup-linux-x64-gnu
npm run build
pip install -r requirements.txt
PRODUCTION=1 ./manage.py migrate
PRODUCTION=1 ./manage.py collectstatic --noinput

sudo service supervisor restart
