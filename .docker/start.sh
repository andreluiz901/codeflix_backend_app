#!/bin/bash

if [ ! -f "./src/@core/env.testing"]; then
  cp ./src/@core/env.example ./src/@core/env.testing
fi

echo "INSTALLING DEPENDENCIES"
npm install

tail -f /dev/null

#echo "STARTING NEST SERVER"
#npm run start:dev
