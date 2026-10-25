(function () {
    'use strict';

    function NetMozi() {
        var network = new Lampa.Reguest();
        var host = 'https://netmozi.com/';
        // Используем публичный CORS-прокси Lampa (или укажите свой)
        var corsProxy = 'https://cors.lamptv.ru/'; 

        this.start = function () {
            Lampa.Component.add('netmozi', Component);
            
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') {
                    Lampa.Menu.add({
                        title: 'NetMozi',
                        icon: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
                        component: 'netmozi',
                        page: 1
                    });
                }
            });
        };

        function Component(object) {
            var comp = this;
            var scroll = new Lampa.Scroll({ mask: true });
            var items = [];
            var html = $('<div></div>');
            var body = $('<div class="category-full"></div>');

            this.create = function () {
                this.activity.loader(true);
                
                // Запрос к главной странице через CORS-прокси
                var targetUrl = corsProxy + host;

                network.native(targetUrl, function (string) {
                    var dom = $($.parseHTML(string));
                    // Подбор контейнеров с фильмами
                    var cards = dom.find('article, .movie-item, .item, .post');

                    cards.each(function () {
                        var card = $(this);
                        var title = card.find('.title, h2, h3, a').first().text().trim();
                        var img = card.find('img').attr('src') || card.find('img').attr('data-src');
                        var url = card.find('a').attr('href');

                        if (img && !img.startsWith('http')) {
                            img = host + img.replace(/^\//, '');
                        }

                        if (title && url) {
                            var item = Lampa.Template.get('card', {
                                title: title,
                                release_year: ''
                            });

                            if (img) item.find('.card__img').attr('src', img);
                            
                            item.on('hover:enter', function () {
                                comp.openMovie(url, title);
                            });

                            body.append(item);
                            items.push(item);
                        }
                    });

                    if (items.length === 0) {
                        comp.activity.empty('Контент не найден / Nem található tartalom');
                    } else {
                        scroll.append(body);
                        html.append(scroll.render());
                    }
                    
                    comp.activity.loader(false);
                    Lampa.Controller.enable('content');
                }, function () {
                    comp.activity.empty('Ошибка сети / Hálózati hiba');
                    comp.activity.loader(false);
                });

                return html;
            };

            this.openMovie = function (url, title) {
                var fullUrl = url.startsWith('http') ? url : host + url.replace(/^\//, '');
                var proxyMovieUrl = corsProxy + fullUrl;

                Lampa.Activity.push({
                    url: fullUrl,
                    title: title,
                    component: 'full',
                    page: 1
                });

                network.native(proxyMovieUrl, function (string) {
                    var dom = $($.parseHTML(string));
                    var iframeSrc = dom.find('iframe').attr('src');

                    if (iframeSrc) {
                        Lampa.Player.play({
                            title: title,
                            url: iframeSrc
                        });
                    } else {
                        Lampa.Noty.show('Плеер не найден / Videó nem található');
                    }
                });
            };

            this.start = function () {
                Lampa.Controller.add('content', {
                    toggle: function () {
                        Lampa.Controller.collectionSet(scroll.render());
                        Lampa.Controller.collectionFocus(items.length ? items[0][0] : false, scroll.render());
                    },
                    left: function () { Lampa.Controller.toggle('menu'); },
                    up: function () { Lampa.Controller.toggle('head'); }
                });
                Lampa.Controller.enable('content');
            };
        }
    }

    if (window.appready) {
        new NetMozi().start();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') new NetMozi().start();
        });
    }
})();
