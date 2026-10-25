(function () {
    'use strict';

    var ID = 'netmozi_hu';
    var TITLE = 'NetMozi HU';
    var COMPONENT_READY = false;
    var MENU_READY = false;
    var INITIALIZED = false;

    var ICON =
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'viewBox="0 0 24 24" width="24" height="24" ' +
        'fill="none" stroke="currentColor" stroke-width="2">' +
        '<rect x="3" y="3" width="18" height="18" rx="3"/>' +
        '<path d="M10 8l6 4-6 4z"/>' +
        '</svg>';

    function log(message) {
        console.log('[NetMozi HU] ' + message);
    }

    function openScreen() {
        try {
            Lampa.Activity.push({
                url: '',
                title: TITLE,
                component: ID,
                page: 1
            });
        } catch (error) {
            log('Activity error: ' + (error.message || error));
        }
    }

    function registerComponent() {
        if (COMPONENT_READY) return true;

        if (!Lampa.Component || !Lampa.Activity) {
            return false;
        }

        try {
            Lampa.Component.add(ID, function () {
                var html;

                this.create = function () {
                    html = $('<div class="netmozi-hu-screen" ' +
                        'style="padding:2em;">' +
                        '<div style="font-size:1.5em;font-weight:bold;">' +
                        'NetMozi HU</div>' +
                        '<div style="margin-top:1em;">' +
                        'A plugin sikeresen betöltődött.</div>' +
                        '<div style="margin-top:0.5em;">' +
                        'A magyar katalógus integrációja következik.</div>' +
                        '</div>';

                    return html;
                };

                this.start = function () {};

                this.pause = function () {};

                this.stop = function () {
                    if (html) html.remove();
                };

                this.destroy = function () {
                    if (html) html.remove();
                };
            });

            COMPONENT_READY = true;
            log('Component registered');
            return true;
        } catch (error) {
            log('Component error: ' + (error.message || error));
            return false;
        }
    }

    function addMenuButton() {
        if (MENU_READY) return true;

        if (!Lampa.Menu ||
            typeof Lampa.Menu.addButton !== 'function') {
            log('Menu.addButton is unavailable');
            return false;
        }

        try {
            Lampa.Menu.addButton(ICON, TITLE, openScreen);
            MENU_READY = true;
            log('Menu button added');
            return true;
        } catch (error) {
            log('Menu error: ' + (error.message || error));
            return false;
        }
    }

    function init() {
        if (INITIALIZED) return true;

        if (!window.Lampa) return false;

        if (!registerComponent()) return false;
        if (!addMenuButton()) return false;

        INITIALIZED = true;
        window.netmozi_hu_plugin_loaded = true;

        log('Plugin initialized');
        return true;
    }

    if (window.appready) {
        init();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }

    var attempts = 0;
    var timer = setInterval(function () {
        attempts++;

        if (init() || attempts >= 40) {
            clearInterval(timer);
        }
    }, 1000);
})();
