#!/bin/sh

rm -rf node_modules # we don't want these copied to the docker image
docker build --no-cache -t modir .

# install node_modules in a named volume
echo installing node_modules in volume modir-node_modules
docker run \
  --rm \
  -v modir-node_modules:/home/app/node_modules \
  modir \
  npm install
