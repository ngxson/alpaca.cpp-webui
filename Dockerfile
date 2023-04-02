FROM node:18.15.0-alpine3.17

RUN apk add gcompat

ENV NODE_ENV=production
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

# volumes need to be mounted bind mount
VOLUME [ "/app/.data" ]
VOLUME [ "/app/bin" ]

CMD npm start