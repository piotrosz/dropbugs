

module DropBugs {
    export enum BugState {
        Undefined,
        Backlog,
        Working,
        Done
    }

    export class Bug {
        Id: number;
        Title: string;
        Description: string;
        State: BugState;
    }

    export class BugZone {
        constructor(public Name: string, public State: BugState) { }
        Bugs: KnockoutObservableArray<Bug>;
    }

    export class ViewModel {
        apiUrl = '/api/bugs/';
        Zones: BugZone[];
        draggingBug: KnockoutObservable<Bug>; // bug that is being dragged currently 
        dragOverState: KnockoutObservable<BugState>;

        constructor() {}

        getAllBugs(): KnockoutObservableArray<Bug>[] {
            return this.Zones.map(z => { return z.Bugs });
        }

        init() {
            $.getJSON(this.apiUrl, data => {
                var backlog = new BugZone("Backlog", BugState.Backlog);
                backlog.Bugs = ko.observableArray<Bug>(data.filter(bug => { return bug.State === BugState.Backlog }));

                var working = new BugZone("Working", BugState.Working);
                working.Bugs = ko.observableArray<Bug>(data.filter(bug => { return bug.State === BugState.Working }));

                var done = new BugZone("Done", BugState.Done);
                done.Bugs = ko.observableArray<Bug>(data.filter(bug => { return bug.State === BugState.Done }));

                this.Zones = [backlog, working, done];

                this.draggingBug = ko.observable<Bug>();
                this.dragOverState = ko.observable<BugState>();   
                
                ko.applyBindings(this);
            });
        }

        changeState(bug: Bug, newState: BugState) {
            var self = this;
            // why {'': bud.Id} ? => http://encosia.com/using-jquery-to-post-frombody-parameters-to-web-api/
            $.post(this.apiUrl + BugState[newState], { '': bug.Id }, data => {
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
} 