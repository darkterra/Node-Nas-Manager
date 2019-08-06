FROM node:12.7.0-buster-slim
LABEL MAINTAINER="DarkTerra"

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install mdadm -y

ADD package.json .

RUN npm i

ADD Controllers/ Controllers/
ADD server.js .

EXPOSE 3000

CMD [ "npm", "start" ]