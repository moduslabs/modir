FROM node:12
RUN yarn
RUN npm install react-app-rewired -g --silent
WORKDIR /home/app
COPY . /home/app
CMD [ "npm", "start" ]
