(function () {
    'use strict';

    var ID = 'netmozi_hu_tv';
    var TITLE = 'NetMozi TV – magyar katalógus';
    var URL = 'https://netmozi.com/tv';
    var SITE_URL = 'https://netmozi.com/';

    function init() {
        if (!window.Lampa ||
            !Lampa.Component ||
            !Lampa.Activity) return;

        if (Lampa.Component.get(ID)) return;

        Lampa.Component.add(ID, function (object) {
            var root;

            this.create = function () {
                root = $('<div style="padding:2em;"></div>');

                root.append(
                    '<div style="font-size:1.6em;font-weight:bold;margin-bottom:1em;">' +
                    'NetMozi TV – magyar katalógus</div>'
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
                        text +
                        '</div>'
                    );

                    button.on('hover:enter', function () {
                        window.location.href = url;
                    });

                    root.append(button);
                }

                addButton(
                    'Filmek és sorozatok megnyitása',
                    URL
                );

                addButton(
                    'NetMozi főoldal',
                    SITE_URL
                );

                root.append(
                    '<div style="margin-top:1.5em;opacity:.7;">' +
                    'A videók lejátszása a NetMozi weboldalán történik.' +
                    '</div>'
                );

                object.activity.render().append(root);
            };

            this.stop = function () {
                if (root) root.remove();
            };
        });

        var menu = $(
            '<li class="menu__item selector netmozi-hu-item">' +
                '<div class="menu__ico">' +
                    '<span style="font-weight:bold;">HU</span>' +
                '</div>' +
                '<div class="menu__text">' +
                    TITLE +
                '</div>' +
            '</li>'
        );

        menu.on('hover:enter', function () {
            Lampa.Activity.push({
                url: '',
                title: TITLE,
                component: ID,
                page: 1
            });
        });

        var list = $('.menu .menu__list').eq(0);

        if (list.length &&
            !$('.netmozi-hu-item').length) {
            list.append(menu);
        }
    }

    if (window.appready) {
        init();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                init();
            }
        });
    }
})();
