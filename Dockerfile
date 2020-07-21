FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /src/web-ui
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19.0-alpine
ENV PORT 8080
ENV HOST 0.0.0.0
WORKDIR /opt/web-ui
COPY --from=source /src/web-ui/dist .
COPY default.template /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]