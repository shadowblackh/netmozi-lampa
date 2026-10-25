(function () {
    'use strict';

    var ID = 'netmozi_diagnostic';
    var TITLE = 'NetMozi HU — teszt';

    function init() {
        if (!window.Lampa || !Lampa.SettingsApi) {
            console.log('[NetMozi] Lampa SettingsApi not found');
            return false;
        }

        if (window.__netmozi_test_loaded) return true;
        window.__netmozi_test_loaded = true;

        try {
            Lampa.SettingsApi.addComponent({
                component: 'netmozi_test',
                name: 'NetMozi HU — teszt'
            });

            Lampa.SettingsApi.addParam({
                component: 'netmozi_test',
                param: {
                    name: 'netmozi_status',
                    type: 'static',
                    default: 'A NetMozi tesztplugin betöltődött.'
                },
                field: {
                    name: 'Állapot',
                    description: 'Ha ezt látod, a plugin kódja lefutott.'
                },
                onRender: function (item) {
                    item.on('hover:enter', function () {});
                }
            });

            console.log('[NetMozi] Test settings registered');
            return true;
        } catch (e) {
            console.log('[NetMozi] Error: ' + e.message);
            return false;
        }
    }

    var attempts = 0;
    var timer = setInterval(function () {
        attempts++;
        if (init() || attempts >= 30) {
            clearInterval(timer);
        }
    }, 1000);
})();
