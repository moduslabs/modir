#!/bin/sh

# run container without making it a daemon - useful to see logging output

docker run \
  --rm \
  --net=host \
  -v $PWD:/home/app \
  --name modir \
  modir

