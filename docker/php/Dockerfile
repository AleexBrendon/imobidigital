FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git unzip curl zip libzip-dev libpng-dev libonig-dev libxml2-dev nginx \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY backend/ /var/www

RUN composer install --no-dev --optimize-autoloader

RUN rm -f /etc/nginx/sites-enabled/default
RUN rm -f /etc/nginx/conf.d/default.conf

RUN composer install --no-dev --optimize-autoloader

RUN mkdir -p storage/framework/cache
RUN mkdir -p storage/framework/sessions
RUN mkdir -p storage/framework/views
RUN mkdir -p storage/logs

RUN chmod -R 777 storage
RUN chmod -R 777 bootstrap/cache

RUN rm -f /etc/nginx/sites-enabled/default
RUN rm -f /etc/nginx/conf.d/default.conf

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD php-fpm -D && nginx -g "daemon off;"