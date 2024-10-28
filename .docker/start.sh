#!/bin/bash

if [ ! -f "./src/@core/.env.test"]; then
  cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

echo "INSTALLING DEPENDENCIES"
npm install

tail -f /dev/null

#echo "STARTING NEST SERVER"
#npm run start:dev
