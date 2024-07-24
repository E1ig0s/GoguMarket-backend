FROM node:20

COPY ./package.json ./yarn.lock /backend/
WORKDIR /backend/
RUN yarn install

COPY . /backend/

CMD yarn start:dev