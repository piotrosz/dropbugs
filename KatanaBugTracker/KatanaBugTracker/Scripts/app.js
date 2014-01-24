/// <reference path="typings/signalr/signalr.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
var BugState;
(function (BugState) {
    BugState[BugState["Undefined"] = 0] = "Undefined";
    BugState[BugState["Backlog"] = 1] = "Backlog";
    BugState[BugState["Working"] = 2] = "Working";
    BugState[BugState["Done"] = 3] = "Done";
})(BugState || (BugState = {}));

var Bug = (function () {
    function Bug() {
    }
    return Bug;
})();

var BugZone = (function () {
    function BugZone(Name, State) {
        this.Name = Name;
        this.State = State;
    }
    return BugZone;
})();

var ViewModel = (function () {
    function ViewModel(model) {
        var backlog = new BugZone("Backlog", 1 /* Backlog */);
        backlog.Bugs = ko.observableArray(model.filter(function (bug) {
            return bug.State === 1 /* Backlog */;
        }));

        var working = new BugZone("Working", 2 /* Working */);
        working.Bugs = ko.observableArray(model.filter(function (bug) {
            return bug.State === 2 /* Working */;
        }));

        var done = new BugZone("Done", 3 /* Done */);
        done.Bugs = ko.observableArray(model.filter(function (bug) {
            return bug.State === 3 /* Done */;
        }));

        this.Zones = [backlog, working, done];

        this.draggingBug = ko.observable();
        this.dragOverState = ko.observable();
    }
    ViewModel.prototype.getAllBugs = function () {
        return this.Zones.map(function (z) {
            return z.Bugs;
        });
    };

    ViewModel.prototype.changeState = function (bug, newState) {
        var self = this;

        // why {'': bud.Id} ? => http://encosia.com/using-jquery-to-post-frombody-parameters-to-web-api/
        $.post(apiUrl + BugState[newState], { '': bug.Id }, function (data) {
            self.moveBug(data);
        });
    };

    ViewModel.prototype.moveBug = function (bug) {
        this.getAllBugs().forEach(function (list) {
            list().forEach(function (item) {
                if (item.Id == bug.Id) {
                    console.log('removing item ' + item.Id);
                    list.remove(item);
                }
            });
        });

        this.Zones.filter(function (z) {
            return z.State == bug.State;
        })[0].Bugs.push(bug);
    };
    return ViewModel;
})();

var apiUrl = '/api/bugs/';

var DragAndDropUtility = (function () {
    function DragAndDropUtility() {
    }
    DragAndDropUtility.handleDragStart = function (bug, event) {
        viewModel.draggingBug(bug);

        // Knockout makes all events preventDefault / return false => I have to return true
        // see: http://stackoverflow.com/questions/7218171/knockout-html5-drag-and-drop
        return true;
    };

    DragAndDropUtility.handleDragOver = function (zone, event) {
        if (event.preventDefault) {
            event.preventDefault();
        }

        if (viewModel.draggingBug().State != zone.State) {
            viewModel.dragOverState(zone.State);
        }
    };

    DragAndDropUtility.handleDragEnter = function (zone, event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
    };

    DragAndDropUtility.handleDrop = function (zone, event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }

        if (zone.State != viewModel.draggingBug().State) {
            viewModel.changeState(viewModel.draggingBug(), zone.State);
        }

        return false;
    };

    DragAndDropUtility.handleDragEnd = function (bug, event) {
        if (event.preventDefault) {
            event.preventDefault();
        }

        viewModel.dragOverState(null);
        viewModel.draggingBug(null);
    };
    return DragAndDropUtility;
})();

var viewModel;

function setUpSignalR() {
    // Use this for debugging purposes
    $.connection.hub.logging = false;

    // Used [] notation to avoid TypeScript error
    // I could also add custom definition file (.d.ts)
    var bugsHub = $.connection["bugs"];

    bugsHub.client.moved = function (item) {
        viewModel.moveBug(item);
    };

    $.connection.hub.start().done(function () {
        console.log('hub connection opened');
    });
}

$(function () {
    setUpSignalR();

    $.getJSON(apiUrl, function (data) {
        viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
    });
});
//# sourceMappingURL=app.js.map
