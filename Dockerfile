FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]