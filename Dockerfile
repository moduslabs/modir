FROM node:12
WORKDIR /home/app
COPY . /home/app
CMD [ "npm", "start" ]
