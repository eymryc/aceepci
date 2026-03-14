# ACEEPCI API - Image PHP Laravel
FROM php:8.4-cli

ARG WWWGROUP=1000
ARG WWWUSER=1000

WORKDIR /var/www/html

# Dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Utilisateur sail (permissions)
RUN groupadd --force -g $WWWGROUP sail \
    && useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u $WWWUSER sail

# PHP config
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/memory-limit.ini

EXPOSE 80

# Démarrer le serveur Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
