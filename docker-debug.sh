#!/bin/sh

# run container without making it a daemon - useful to see logging output

docker run \
  --rm \
  -p 3000:3000 \
  -v $PWD:/home/app \
  -v modir-node_modules:/home/app/node_modules \
  --name modir \
  modir

