'use strict';

class Router {
    constructor(routes) {
        try {
            if (!routes) {
                throw 'error: routes param is mandatory';
            }
            this.savedRoutes = routes;
            this.rootElem = document.getElementById('app');
            this.init();
        } catch (error) {
            console.error(error);
        }
    }

    init() {
        (function (scope, routes) {
            window.addEventListener('hashchange', function () {
                scope.hasChanged(scope, routes);
            });
        })(this, this.savedRoutes);
        this.hasChanged(this, this.savedRoutes);
    }

    hasChanged(scope, routes) {
        (function (scope) {
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
        })(scope);
    }

    goToRoute(htmlFile) {
        (function (scope) {
            let url = 'views/' + htmlFile,
                xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    scope.rootElem.innerHTML = this.responseText;
                    let scriptFile = './state_scripts/' + htmlFile.split('.')[0] + '.js';
                    import(scriptFile).then(module =>
                        module.initPage()
                    ).catch();
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        })(this);
    }
}
