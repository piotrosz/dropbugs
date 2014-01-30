module DropBugs
{
    export class DragAndDropUtility {
        constructor() {
        }

        static handleDragStart(bug: Bug, event) {
            viewModel.draggingBug(bug);

            // Knockout makes all events preventDefault / return false => I have to return true
            // see: http://stackoverflow.com/questions/7218171/knockout-html5-drag-and-drop

            return true;
        }

        static handleDragOver(zone: BugZone, event) {
            if (event.preventDefault) { event.preventDefault(); } // Necessary. Allows to drop.

            if (viewModel.draggingBug().State != zone.State) {
                viewModel.dragOverState(zone.State);
            }
        }

        static handleDragEnter(zone: BugZone, event) {
            if (event.preventDefault) { event.preventDefault(); }
        }

        static handleDrop(zone: BugZone, event) {
            if (event.stopPropagation) { event.stopPropagation(); }

            if (zone.State != viewModel.draggingBug().State) {
                viewModel.changeState(viewModel.draggingBug(), zone.State);
            }

            return false;
        }

        static handleDragEnd(bug: Bug, event) {
            if (event.preventDefault) { event.preventDefault(); }

            viewModel.dragOverState(null);
            viewModel.draggingBug(null);
        }
    }
} 