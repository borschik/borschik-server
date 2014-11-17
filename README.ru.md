# borschik-server
[![Build Status](https://travis-ci.org/bem/borschik-server.png?branch=master)](https://travis-ci.org/bem/borschik-server)
[![NPM version](https://badge.fury.io/js/borschik-server.png)](http://badge.fury.io/js/borschik-server)
[![Dependency Status](https://david-dm.org/bem/borschik-server.png)](https://david-dm.org/bem/borschik-server)

HTTP-сервер для обработки JS и CSS файлов утилитой [borschik](https://github.com/bem/borschik) по запросу.

Это сервер **сугубо для разработки**.

## Поведение по умолчанию
1. Если файл существует, отдавать его
2. Обрабатывать только файлы с префиксом `_` (может быть переопределено в `path-resolver`)
3. Минимизация отключена
4. Заморозка (фриз) отключена

Несколько примеров:
 1. Запрос `http://example.com/js/file.js`. `file.js` существует, `borschik-server` считывает этот файл 
и возвращает его.
 2. Запрос `http://example.com/js/_file.js`. `file.js` не существует, `borschik-server` отбрасывает префикс `_`,
считывает файл `file.js` и обрабатывает его с помощью `borschik`.

## Установка
```
npm install -g borschik-server 
```

## Использование
Просто запустите `borschik-server` и настройте свой веб-сервер. Если вы хотите использовать borschik-server как 
init.d-скрипт, используйте [этот шаблон для Ubuntu](https://gist.github.com/peterhost/715255)

## Конфигурация веб-сервера
Вы должны настроить проксирование http-запросов за статикой на своем веб-сервере (apache, lighttpd, nginx и т.д.) на 
borschik-server.

Пример конфигурации nginx:
```
location ~* "\.(css|js)$" {
    # проксируем все запросы за css/js на borschik-server
    # используем $uri (не $request_uri) для рерайта
    proxy_pass http://127.0.0.1:8055$document_root$uri;
}
```

## Как расширить базовую конфигурацию новыми технологиями
Вы можете создать свой собственный сервер с помощью следующего кода
```js
require('borschik-server').server({
    port: 8055,
    techResolver: require('../lib/tech-resolver')
});
```

Этот код использует ваш собственный tech-resolver.
Вы можете найти пример в [юнит-тестах](https://github.com/bem/borschik-server/blob/master/test/mock/custom-tech-resolver.js). В этом примере мы добавили поддержку 
новой `.styl` технологии.

Кроме того, вы можете переопределить pathResolver. [Пример](https://github.com/bem/borschik-server/blob/master/test/mock/custom-path-resolver.js). В этом примере мы 
определяем собранные файлы как `file.min.js`.

## Лицензия
[MIT](https://github.com/bem/borschik-server/blob/master/MIT-LICENSE.txt)
