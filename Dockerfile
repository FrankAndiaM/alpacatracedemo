FROM nginx:1.15

RUN apt-get -y update && apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

WORKDIR /var/front

COPY . .
COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf

RUN npm install
RUN npm run build

EXPOSE 80
