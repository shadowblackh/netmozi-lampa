(function () {
    'use strict';

    var ID = 'netmozi_hu';
    var TITLE = 'NetMozi HU';

    function init() {
        if (!window.Lampa || !Lampa.Sidebar || !Lampa.Component) {
            return false;
        }

        if (window.__netmozi_cub_loaded) return true;

        try {
            // 1. Регистрируем компонент страницы Lampa
            Lampa.Component.add(ID, function () {
                var scroll = new Lampa.Scroll({ mask: true });
                var items  = new Lampa.Items();
                var html   = $('<div></div>');

                this.create = function () {
                    return html;
                };

                this.start = function () {
                    html.append(scroll.render());
                    scroll.append(items.render());

                    var empty = $('<div class="empty">NetMozi HU — Plugin sikeresen betöltve!</div>');
                    items.append(empty);

                    this.activity.toggle();
                };

                this.pause = function () {};
                this.stop  = function () {};
                this.destroy = function () {
                    scroll.destroy();
                    items.destroy();
                    html.remove();
                };
            });

            // 2. Регистрируем пункт в боковом меню (Совместимо с CUB и стандартной Lampa)
            var menuItem = {
                title: TITLE,
                icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
                type: ID,
                page: ID,
                onSelect: function () {
                    Lampa.Activity.push({
                        title: TITLE,
                        component: ID,
                        page: 1
                    });
                }
            };

            // Добавление в Sidebar Lampa / CUB
            if (Lampa.Sidebar && typeof Lampa.Sidebar.add === 'function') {
                Lampa.Sidebar.add(menuItem);
            }

            // Добавление в Настройки
            if (Lampa.SettingsApi) {
                Lampa.SettingsApi.addComponent({
                    component: ID + '_settings',
                    name: TITLE
                });

                Lampa.SettingsApi.addParam({
                    component: ID + '_settings',
                    param: {
                        name: 'netmozi_status',
                        type: 'static',
                        default: 'Betöltve'
                    },
                    field: {
                        name: 'Állapot',
                        description: 'NetMozi HU plugin aktív.'
                    }
                });
            }

            window.__netmozi_cub_loaded = true;
            console.log('[NetMozi] Successfully loaded via CUB');
            return true;
        } catch (e) {
            console.error('[NetMozi] Load error:', e);
            return true;
        }
    }

    // Слушатель готовности Lampa
    if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                init();
            }
        });
    }

    // Фоллбек таймер для гарантии запуска
    var attempts = 0;
    var timer = setInterval(function () {
        attempts++;
        if (init() || attempts >= 30) {
            clearInterval(timer);
        }
    }, 500);
})();
