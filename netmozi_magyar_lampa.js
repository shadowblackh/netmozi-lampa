(function () {
    'use strict';

    var ID = 'netmozi_hu_tv';
    var TITLE = 'NetMozi – magyar katalógus';
    var TV_URL = 'https://netmozi.com/tv';

    if (window.plugin_netmozi_hu_ready) return;
    window.plugin_netmozi_hu_ready = true;

    function startPlugin() {
        if (!window.Lampa ||
            !Lampa.Component ||
            !Lampa.Activity ||
            !Lampa.Menu ||
            !Lampa.Menu.addButton) {
            console.log('[NetMozi HU] Menu API not available');
            return;
        }

        function NetMoziScreen(object) {
            var root;

            this.create = function () {
                root = $('<div style="padding:2em;"></div>');

                root.append(
                    '<div style="font-size:1.5em;font-weight:bold;">' +
                    'NetMozi – magyar katalógus</div>'
                );

                root.append(
                    '<div style="margin:1em 0;">' +
                    'Magyar filmek és sorozatok</div>'
                );

                var open = $(
                    '<div class="selector" style="padding:1em;' +
                    'background:rgba(255,255,255,.12);">' +
                    'NetMozi TV megnyitása</div>'
                );

                open.on('hover:enter', function () {
                    window.location.href = TV_URL;
                });

                root.append(open);
                object.activity.render().append(root);
            };

            this.stop = function () {
                if (root) root.remove();
            };
        }

        if (!Lampa.Component.get(ID)) {
            Lampa.Component.add(ID, NetMoziScreen);
        }

        var icon =
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
            '<text x="2" y="18" font-size="15" fill="currentColor">HU</text>' +
            '</svg>';

        Lampa.Menu.addButton(icon, TITLE, function () {
            Lampa.Activity.push({
                url: '',
                title: TITLE,
                component: ID,
                page: 1
            });
        });

        console.log('[NetMozi HU] Plugin initialized');
    }

    if (window.appready) {
        startPlugin();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') startPlugin();
        });
    } else {
        console.log('[NetMozi HU] Waiting for Lampa');
    }
})();
