FROM node:14
COPY . /home/modir
WORKDIR /home/modir
RUN yarn install
CMD [ "yarn", "start" ]
