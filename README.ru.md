# borschik-server
[![Build Status](https://travis-ci.org/bem/borschik-server.png?branch=master)](https://travis-ci.org/bem/borschik-server)
[![NPM version](https://badge.fury.io/js/borschik-server.png)](http://badge.fury.io/js/borschik-server)
[![Dependency Status](https://david-dm.org/bem/borschik-server.png)](https://david-dm.org/bem/borschik-server)

HTTP server to processes JS and CSS files with [borschik](https://github.com/bem/borschik) on demand.
HTTP-сервер для обработки JS и CSS файлов утилитой [borschik](https://github.com/bem/borschik) по запросу.

This server is **for development use only**.
Это **сугубо разработческий** сервер.

## Default behavour
1. If file exists, response as is
2. Process files with `_` prefix only (can be redefined in `path-resolver`)
3. Minimize is disabled
4. Freeze is disabled

## Поведение по умолчанию
1. Если файл есть, отвечать как есть
2. Обрабатывать только файлы с префиксом `_` (они могут быть переопределены в `path-resolver`)
3. Минимизация отключена
4. Заморозка (фриз) отключен

Some examples:
 1. You request is `http://example.com/js/file.js`. `file.js` exists, `borschik-server` reads this file
and writes to output as is.
 2. You request is `http://example.com/js/_file.js`. `file.js` doesn't exist, `borschik-server` removes `_` prefix,
reads file `file.js` and processes it with `borschik`.

Несколько примеров:
 1. Запрос `http://example.com/js/file.js`. `file.js` существует, `borschik-server` считывает этот файл 
и записывает в аутпут.
 2. Запрос `http://example.com/js/_file.js`. `file.js` не существует, `borschik-server` удаляет префикс `_`,
считывает файл `file.js` и обрабатывает его с помощью `borschik`.

## Installation
```
npm install -g borschik-server 
```

## Установка
```
npm install -g borschik-server 
```

## Usage
Just run `borschik-server` and setup your webserver. If you want to use borschik-server as init.d script
follow [this template for Ubuntu](https://gist.github.com/peterhost/715255)

## Использование
Просто запустите `borschik-server` и настройте свой веб-сервер. Если вы хотите использовать borschik-server как 
init.d script, следуйте [этому шаблону для Убунту](https://gist.github.com/peterhost/715255)

## Webserver configuration
You should setup your webserver (apache, lighttpd, nginx, etc.) to proxy http requests for static 
files to borschik-server.

## Конфигурация веб-сервера
Вы должны настроить свой веб-сервер (apache, lighttpd, nginx, etc.) на прокси http запросы для статических файлов на 
borschik-server.

Example nginx configuration:
```
location ~* "\.(css|js)$" {
    # proxy all requests for css/js to borschik-server
    # use $uri (not $request_uri) to deal with rewrite
    proxy_pass http://127.0.0.1:8055$document_root$uri;
}
```
Пример конфигурации nginx:
```
location ~* "\.(css|js)$" {
    # proxy all requests for css/js to borschik-server
    # use $uri (not $request_uri) to deal with rewrite
    proxy_pass http://127.0.0.1:8055$document_root$uri;
}
```


## How to extend with new technologies
You can create you own server with this code
```js
require('borschik-server').server({
    port: 8055,
    techResolver: require('../lib/tech-resolver')
});
```
## Как расширить базовые конфигурации новыми технологиями
Вы можете создать свой собственный сервер с помощью следующего кода
```js
require('borschik-server').server({
    port: 8055,
    techResolver: require('../lib/tech-resolver')
});
```

This code references to your own tech-resolver.
You can find example in [unit tests](./test/mock/custom-tech-resolver.js). In this example we add support 
for new ".styl" tech.

Этот код отсылает к вашему собственному tech-resolver'у.
Вы можете найти пример в [юнит-тестах](./test/mock/custom-tech-resolver.js). В этом примере мы добавили поддержку 
нового ".styl" tech.

You can redefine pathResolver as well. [Example](./test/mock/custom-path-resolver.js). In this example we 
define builed files as `file.min.js`.

Кроме того, вы можете переопределить pathResolver. [Пример](./test/mock/custom-path-resolver.js). В этом примере мы 
определяем собранные файлы как `file.min.js`.

## Лицензия
[MIT](/MIT-LICENSE.txt)
