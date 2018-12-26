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

    transformToDictionary(string) {
        let result = {};
        let params = string.split('&&');
        for (var i in params) {
            let array = params[i].split("=");
            result[decodeURIComponent(array[0])] = decodeURIComponent(array[1]);
        }
        return result;
    }

    hasChanged(scope, routes) {
        (function (scope) {
            let foundPage = false;
            if (window.location.hash.length > 0) {
                routes.forEach(route => {
                    let urlAfterDomain = window.location.hash.substr(1).split('?');
                    let params = null;
                    if (urlAfterDomain[1] != null) {
                        params = scope.transformToDictionary(urlAfterDomain[1]);
                    }
                    if (route.isActiveRoute(urlAfterDomain[0])) {
                        foundPage = true;
                        scope.goToRoute(route.htmlFile, params);
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

    goToRoute(htmlFile, params) {
        (function (scope) {
            let url = 'views/' + htmlFile,
                xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    scope.rootElem.innerHTML = this.responseText;
                    let scriptFile = './state_scripts/' + htmlFile.split('.')[0] + '.js';
                    window.scrollTo(0, 0);
                    import(scriptFile).then(module =>
                        module.initPage(params)
                    ).catch();
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        })(this);
    }
}
