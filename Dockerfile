FROM node:12
RUN yarn
WORKDIR /home/app
COPY . /home/app
CMD [ "npm", "start" ]
