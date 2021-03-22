FROM node:12
COPY . /home/modir
WORKDIR /home/modir
RUN npm install
CMD [ "npm", "start" ]
