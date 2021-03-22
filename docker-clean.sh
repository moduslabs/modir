#!/bin/sh

# Clean up all files relaated to our Docker builds, including any images and volumes

# containers
docker ps -a | grep modir | awk '{rprint $1}' | xargs docker rm

# volumes
docker volume rm modir-node_modules
