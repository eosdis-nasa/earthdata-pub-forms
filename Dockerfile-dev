FROM node:18.14.1-slim

# apt update -y
# RUN apt-get -y update \
# 	&& apt-get install -y git

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# install Vue CLI
RUN npm install @vue/cli

EXPOSE 8080
CMD ["npm", "run", "serve"]
