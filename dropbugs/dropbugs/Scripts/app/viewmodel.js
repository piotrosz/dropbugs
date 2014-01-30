var DropBugs;
(function (DropBugs) {
    (function (BugState) {
        BugState[BugState["Undefined"] = 0] = "Undefined";
        BugState[BugState["Backlog"] = 1] = "Backlog";
        BugState[BugState["Working"] = 2] = "Working";
        BugState[BugState["Done"] = 3] = "Done";
    })(DropBugs.BugState || (DropBugs.BugState = {}));
    var BugState = DropBugs.BugState;

    var Bug = (function () {
        function Bug() {
        }
        return Bug;
    })();
    DropBugs.Bug = Bug;

    var BugZone = (function () {
        function BugZone(Name, State) {
            this.Name = Name;
            this.State = State;
        }
        return BugZone;
    })();
    DropBugs.BugZone = BugZone;

    var ViewModel = (function () {
        function ViewModel() {
            this.apiUrl = '/api/bugs/';
        }
        ViewModel.prototype.getAllBugs = function () {
            return this.Zones.map(function (z) {
                return z.Bugs;
            });
        };

        ViewModel.prototype.init = function () {
            var _this = this;
            $.getJSON(this.apiUrl, function (data) {
                var backlog = new BugZone("Backlog", 1 /* Backlog */);
                backlog.Bugs = ko.observableArray(data.filter(function (bug) {
                    return bug.State === 1 /* Backlog */;
                }));

                var working = new BugZone("Working", 2 /* Working */);
                working.Bugs = ko.observableArray(data.filter(function (bug) {
                    return bug.State === 2 /* Working */;
                }));

                var done = new BugZone("Done", 3 /* Done */);
                done.Bugs = ko.observableArray(data.filter(function (bug) {
                    return bug.State === 3 /* Done */;
                }));

                _this.Zones = [backlog, working, done];

                _this.draggingBug = ko.observable();
                _this.dragOverState = ko.observable();

                ko.applyBindings(_this);
            });
        };

        ViewModel.prototype.changeState = function (bug, newState) {
            var self = this;

            // why {'': bud.Id} ? => http://encosia.com/using-jquery-to-post-frombody-parameters-to-web-api/
            $.post(this.apiUrl + BugState[newState], { '': bug.Id }, function (data) {
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
    DropBugs.ViewModel = ViewModel;
})(DropBugs || (DropBugs = {}));
//# sourceMappingURL=ViewModel.js.map
