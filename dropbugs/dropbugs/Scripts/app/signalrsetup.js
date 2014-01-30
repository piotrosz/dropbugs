/// <reference path="app.ts" />
var DropBugs;
(function (DropBugs) {
    function setUpSignalR() {
        // Use this for debugging purposes
        $.connection.hub.logging = false;

        // Used [] notation to avoid TypeScript error
        // I could also add custom definition file (.d.ts)
        var bugsHub = $.connection["bugs"];

        bugsHub.client.moved = function (item) {
            DropBugs.viewModel.moveBug(item);
        };

        $.connection.hub.start().done(function () {
            console.log('hub connection opened');
        });
    }
    DropBugs.setUpSignalR = setUpSignalR;
})(DropBugs || (DropBugs = {}));
//# sourceMappingURL=SignalRSetup.js.map
