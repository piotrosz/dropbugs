/// <reference path="typings/signalr/signalr.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />

enum BugState
{
    Undefined,
    Backlog,
    Working,
    Done
}

class Bug
{
    Id: number;
    Title: string;
    Description: string;
    State: BugState;
}

class BugZone
{
    constructor(public Name: string, public State: BugState) { }
    Bugs: KnockoutObservableArray<Bug>;
}

class ViewModel {

    Zones: BugZone[];
    draggingBug: KnockoutObservable<Bug>; // bug that is being dragged currently 
    dragOverState: KnockoutObservable<BugState>; 

    constructor(model: Bug[]) {

        var backlog = new BugZone("Backlog", BugState.Backlog);
        backlog.Bugs = ko.observableArray(model.filter(bug => { return bug.State === BugState.Backlog }));
        
        var working = new BugZone("Working", BugState.Working);
        working.Bugs = ko.observableArray(model.filter(bug => { return bug.State === BugState.Working }));
        
        var done = new BugZone("Done", BugState.Done);
        done.Bugs = ko.observableArray(model.filter(bug => { return bug.State === BugState.Done }));
        
        this.Zones = [backlog, working, done];

        this.draggingBug = ko.observable<Bug>();
        this.dragOverState = ko.observable<BugState>();
    }

    getAllBugs() : KnockoutObservableArray<Bug>[] {
        return this.Zones.map(z => { return z.Bugs });
    }

    changeState(bug: Bug, newState: BugState) {
        var self = this;
        // why {'': bud.Id} ? => http://encosia.com/using-jquery-to-post-frombody-parameters-to-web-api/
        $.post(apiUrl + BugState[newState], { '': bug.Id }, data => {
            self.moveBug(data);
        });
    }

    moveBug(bug: Bug) {
        this.getAllBugs().forEach(list => {
            list().forEach(item => {
                if (item.Id == bug.Id) {
                    console.log('removing item ' + item.Id);
                    list.remove(item);
                }
            });
        });

        this.Zones.filter(z => z.State == bug.State)[0].Bugs.push(bug);
    }
}

var apiUrl = '/api/bugs/';

class DragAndDropUtility
{
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

    static handleDragEnd(bug: Bug, event)
    {
        if (event.preventDefault) { event.preventDefault(); }

        viewModel.dragOverState(null);
        viewModel.draggingBug(null);
    }
}

var viewModel : ViewModel;

function setUpSignalR()
{
    // Use this for debugging purposes
    $.connection.hub.logging = false;
    
    // Used [] notation to avoid TypeScript error
    // I could also add custom definition file (.d.ts)
    var bugsHub = $.connection["bugs"]; 

    bugsHub.client.moved = item => {
        viewModel.moveBug(item);
    };

    $.connection.hub.start().done(() => {
        console.log('hub connection opened');
    });
}

$(() => {
    setUpSignalR();

    $.getJSON(apiUrl, function (data) {
        viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
    });
});