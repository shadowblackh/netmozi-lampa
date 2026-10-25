(function () {
    'use strict';

    var ID = 'netmozi_hu_tv';
    var TITLE = 'NetMozi TV – magyar katalógus';
    var TV_URL = 'https://netmozi.com/tv';
    var SITE_URL = 'https://netmozi.com/';
    var MENU_CLASS = 'netmozi-hu-item';

    function openSite(url) {
        if (url !== TV_URL && url !== SITE_URL) return;
        window.location.href = url;
    }

    function Screen(object) {
        var root;

        this.create = function () {
            root = $('<div style="padding:2em;"></div>');

            root.append(
                '<div style="font-size:1.6em;font-weight:bold;margin-bottom:1em;">' +
                TITLE + '</div>'
            );

            root.append(
                '<div style="margin-bottom:1.5em;">' +
                'Magyar filmek és sorozatok</div>'
            );

            function addButton(text, url) {
                var button = $(
                    '<div class="selector" tabindex="0" ' +
                    'style="padding:1em;margin:.7em 0;' +
                    'background:rgba(255,255,255,.12);' +
                    'border-radius:.4em;">' +
                    text + '</div>'
                );

                button.on('hover:enter', function () {
                    openSite(url);
                });

                root.append(button);
            }

            addButton(
                'Filmek és sorozatok megnyitása',
                TV_URL
            );

            addButton('NetMozi főoldal', SITE_URL);

            root.append(
                '<div style="margin-top:1.5em;opacity:.7;">' +
                'A videók a NetMozi weboldalán indulnak el, ' +
                'ha a weboldal támogatja az eszközt.</div>'
            );

            object.activity.render().append(root);
        };

        this.pause = function () {};

        this.stop = function () {
            if (root) {
                root.find('.selector').off('hover:enter');
                root.remove();
                root = null;
            }
        };
    }

    function addMenuItem() {
        if (!window.Lampa ||
            !Lampa.Component ||
            !Lampa.Activity) return false;

        if (!Lampa.Component.get(ID)) {
            Lampa.Component.add(ID, Screen);
        }

        var list = $('.menu .menu__list').first();

        if (!list.length) {
            list = $('.menu__list').first();
        }

        if (!list.length) return false;

        if ($('.' + MENU_CLASS).length) return true;

        var item = $(
            '<li class="menu__item selector ' +
            MENU_CLASS + '">' +
                '<div class="menu__ico">' +
                    '<span style="font-weight:bold;">HU</span>' +
                '</div>' +
                '<div class="menu__text">' +
                    TITLE +
                '</div>' +
            '</li>'
        );

        item.on('hover:enter', function () {
            Lampa.Activity.push({
                url: '',
                title: TITLE,
                component: ID,
                page: 1
            });
        });

        list.append(item);
        return true;
    }

    function start() {
        if (!window.Lampa) return;

        addMenuItem();

        if (Lampa.Listener &&
            !window.__netmoziHuListenerAdded) {

            window.__netmoziHuListenerAdded = true;

            Lampa.Listener.follow('app', function (event) {
                if (event.type === 'ready') {
                    addMenuItem();
                }
            });

            Lampa.Listener.follow('activity', function () {
                addMenuItem();
            });
        }
    }

    if (window.appready) {
        start();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') start();
        });
    } else {
        var attempts = 0;

        function retry() {
            attempts++;

            if (window.Lampa) {
                start();
            } else if (attempts < 20) {
                setTimeout(retry, 500);
            }
        }

        retry();
    }
})();
