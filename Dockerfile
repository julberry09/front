FROM node:16.13.2
WORKDIR "/usr/src/app"
COPY package.json ./
RUN npm install
COPY ./ ./
EXPOSE 3000

ARG ENVIRONMENT
ENV FRONT_ENV="${ENVIRONMENT}"
CMD npm run start:$FRONT_ENV