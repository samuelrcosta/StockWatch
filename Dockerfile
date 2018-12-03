FROM node:10-alpine

ENV HOME=/home/www

COPY . .

RUN npm install