FROM node:current-alpine as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm clean-install
COPY . .
RUN npm run build

FROM nginx:mainline-alpine
EXPOSE 80
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
