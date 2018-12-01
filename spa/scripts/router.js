'use strict';

function Router(routes) {
    try {
        if (!routes) {
            throw 'error: routes param is mandatory';
        }
        this.constructor(routes);
        this.init();
    } catch (e) {
        console.error(e);
    }
}

Router.prototype = {
    savedRoutes: undefined,
    rootElem: undefined,
    constructor(routes) {
        this.savedRoutes = routes;
        this.rootElem = document.getElementById('app');
    },
    init: function () {
        (function (scope, routes) {
            window.addEventListener('hashchange', function (e) {
                scope.hasChanged(scope, routes);
            });
        })(this, this.savedRoutes);
        this.hasChanged(this, this.savedRoutes);
    },
    hasChanged: function (scope, routes) {
        let foundPage = false;
        if (window.location.hash.length > 0) {
            routes.forEach(route => {
                if (route.isActiveRoute(window.location.hash.substr(1))) {
                    foundPage = true;
                    scope.goToRoute(route.htmlFile);
                }
            });
        } else {
            routes.forEach(route => {
                if (route.default) {
                    foundPage = true;
                    scope.goToRoute(route.htmlFile);
                }
            });
        }
        if (!foundPage) {
            scope.goToRoute('page_not_found.html');
        }
    },
    goToRoute: function (htmlFile) {
        (function (scope) {
            let url = 'views/' + htmlFile,
                xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    scope.rootElem.innerHTML = this.responseText;
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        })(this);
    }
};