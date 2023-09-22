FROM node:alpine

WORKDIR /var/www/app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD [ "npm", "start" ]