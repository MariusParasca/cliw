'use strict';

class Route {
    constructor(stateName, htmlFile, defaultRoute) {
        try {
            if (!stateName || !htmlFile) {
                throw 'error: stateName and htmlFile params are mandatories';
            }
            this.stateName = stateName;
            this.htmlFile = htmlFile;
            this.default = defaultRoute;
        } catch (error) {
            console.error(error);
        }
    }

    isActiveRoute(hashedPath) {
        return hashedPath.replace('#', '') === this.stateName;
    }
}
