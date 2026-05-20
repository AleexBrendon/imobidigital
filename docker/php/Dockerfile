# Imagem base PHP-FPM
FROM php:8.3-fpm

# Instala pacotes e extensões PHP necessárias
RUN apt-get update && apt-get install -y \
    git unzip curl zip libzip-dev libpng-dev libonig-dev libxml2-dev nginx \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define diretório de trabalho
WORKDIR /var/www

# Copia o código da aplicação
COPY . /var/www

# Copia configuração do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expõe porta HTTP
EXPOSE 80

# Inicializa Nginx e PHP-FPM juntos
CMD service nginx start && php-fpm
