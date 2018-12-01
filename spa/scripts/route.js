'use strict';

function Route(stateName, htmlFile, defaultRoute) {
    try {
        if(!stateName || !htmlFile) {
            throw 'error: stateName and htmlFile params are mandatories';
        }
        this.constructor(stateName, htmlFile, defaultRoute);
    } catch (e) {
        console.error(e);
    }
}

Route.prototype = {
    stateName: undefined,
    htmlFile: undefined,
    default: undefined,
    constructor: function (stateName, htmlFile, defaultRoute) {
        this.stateName = stateName;
        this.htmlFile = htmlFile;
        this.default = defaultRoute;
    },
    isActiveRoute: function (hashedPath) {
        return hashedPath.replace('#', '') === this.stateName; 
    }
}