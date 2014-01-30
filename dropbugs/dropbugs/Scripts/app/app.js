/// <reference path="../typings/signalr/signalr.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="draganddroputility.ts" />
/// <reference path="signalrsetup.ts" />
/// <reference path="viewmodel.ts" />
var DropBugs;
(function (DropBugs) {
    DropBugs.viewModel;

    $(function () {
        DropBugs.setUpSignalR();

        DropBugs.viewModel = new DropBugs.ViewModel();
        DropBugs.viewModel.init();
    });
})(DropBugs || (DropBugs = {}));
//# sourceMappingURL=app.js.map
