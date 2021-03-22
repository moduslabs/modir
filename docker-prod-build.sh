#!/bin/sh

# Run yarn build within the already built docker container to generate the build/ files.

# Use docker-build.sh script to make the already built container to be used.

# The .sh scripts for Docker use a named volume to contain the node_modules/ directory.  Doing so
# allows the named volume to be mounted on top of our working directory bind.

# The working directory bind allows us to run the debug.sh script and edit files and the npm start in the
# container act like its local files are changed. This is ideal for editing/debugging without having to
# build/stop/restart the container.

echo Building production version in build/
docker run \
  --rm  \
  -v $PWD:/home/app \
  -v modir-node_modules:/home/app/node_modules \
  modir \
  yarn build
