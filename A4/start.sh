source ./.env/bin/activate                  # activate virtualenv
pip install -r backend/requirements.txt     # install required pip modules
cd frontend && npm i                        # install required npm modules
npm run build                               # building frontend
cd ../backend && ./runserver.sh             # running backend   