#!/bin/bash
# Install python and JS dependencies, run migrations, collectstatic and restart supervisor

source /home/poker/virtualenv/bin/activate
cd ~/planning-poker || exit
git reset --hard origin/master
npm ci
npm install @rollup/rollup-linux-x64-gnu
npm run build
pip install -r requirements.txt
PRODUCTION=1 ./manage.py migrate
PRODUCTION=1 ./manage.py collectstatic --noinput

sudo service supervisor restart
