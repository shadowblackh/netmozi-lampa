(function () {
    'use strict';

    var PLUGIN_ID = 'netmozi_plugin';
    var PLUGIN_TITLE = 'NetMozi HU';

    function init() {
        if (!window.Lampa || !Lampa.SettingsApi || !Lampa.Activity) {
            return false;
        }

        if (window.__netmozi_plugin_loaded) return true;

        try {
            // 1. Создаем экран (компонент), который откроется при нажатии в меню
            Lampa.Component.add(PLUGIN_ID, function () {
                var network = new Lampa.Reguest();
                var scroll  = new Lampa.Scroll({ mask: true });
                var items   = new Lampa.Items();
                var html    = $('<div></div>');

                this.create = function () {
                    return html;
                };

                this.start = function () {
                    var _this = this;

                    // Базовый контейнер для содержимого
                    html.append(scroll.render());
                    scroll.append(items.render());

                    // Пример вывода текста или состояния на экран
                    var info = $('<div class="empty">NetMozi HU — Страница плагина готова к работе.</div>');
                    items.append(info);

                    // Фокусируемся на элементе для корректного управления с пульта Smart TV
                    this.activity.toggle();
                };

                this.pause = function () {};
                this.stop  = function () {};

                this.destroy = function () {
                    network.clear();
                    scroll.destroy();
                    items.destroy();
                    html.remove();
                };
            });

            // 2. Добавляем пункт в левое боковое меню Lampa
            var addSidebarItem = function () {
                var item = {
                    title: PLUGIN_TITLE,
                    icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>',
                    type: PLUGIN_ID,
                    onSelect: function () {
                        Lampa.Activity.push({
                            title: PLUGIN_TITLE,
                            component: PLUGIN_ID,
                            page: 1
                        });
                    }
                };

                if (Lampa.Sidebar && Lampa.Sidebar.add) {
                    Lampa.Sidebar.add(item);
                } else if (Lampa.Menu && Lampa.Menu.add) {
                    Lampa.Menu.add(item);
                }
            };

            addSidebarItem();

            // 3. Добавляем раздел настроек плагина (Настройки -> NetMozi HU)
            Lampa.SettingsApi.addComponent({
                component: PLUGIN_ID + '_settings',
                name: PLUGIN_TITLE
            });

            Lampa.SettingsApi.addParam({
                component: PLUGIN_ID + '_settings',
                param: {
                    name: 'netmozi_status',
                    type: 'static',
                    default: 'Плагин активен'
                },
                field: {
                    name: 'Состояние',
                    description: 'Плагин успешно зарегистрирован в боковом меню и настройках.'
                }
            });

            window.__netmozi_plugin_loaded = true;
            console.log('[NetMozi] Plugin successfully initialized');
            return true;
        } catch (e) {
            console.error('[NetMozi] Initialization error:', e);
            return true; // Предотвращаем бесконечный повтор при критической ошибке
        }
    }

    // Безопасный запуск через Listener или таймер
    if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

    var attempts = 0;
    var timer = setInterval(function () {
        attempts++;
        if (init() || attempts >= 30) {
            clearInterval(timer);
        }
    }, 500);
})();
