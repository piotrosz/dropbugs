var DropBugs;
(function (DropBugs) {
    var DragAndDropUtility = (function () {
        function DragAndDropUtility() {
        }
        DragAndDropUtility.handleDragStart = function (bug, event) {
            DropBugs.viewModel.draggingBug(bug);

            // Knockout makes all events preventDefault / return false => I have to return true
            // see: http://stackoverflow.com/questions/7218171/knockout-html5-drag-and-drop
            return true;
        };

        DragAndDropUtility.handleDragOver = function (zone, event) {
            if (event.preventDefault) {
                event.preventDefault();
            }

            if (DropBugs.viewModel.draggingBug().State != zone.State) {
                DropBugs.viewModel.dragOverState(zone.State);
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

            if (zone.State != DropBugs.viewModel.draggingBug().State) {
                DropBugs.viewModel.changeState(DropBugs.viewModel.draggingBug(), zone.State);
            }

            return false;
        };

        DragAndDropUtility.handleDragEnd = function (bug, event) {
            if (event.preventDefault) {
                event.preventDefault();
            }

            DropBugs.viewModel.dragOverState(null);
            DropBugs.viewModel.draggingBug(null);
        };
        return DragAndDropUtility;
    })();
    DropBugs.DragAndDropUtility = DragAndDropUtility;
})(DropBugs || (DropBugs = {}));
//# sourceMappingURL=DragAndDropUtility.js.map
