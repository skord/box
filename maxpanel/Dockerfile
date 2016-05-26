FROM nginx
RUN mv /usr/share/nginx/html /www
ADD ./default.conf /etc/nginx/conf.d/default.conf
ADD dist/ /app
