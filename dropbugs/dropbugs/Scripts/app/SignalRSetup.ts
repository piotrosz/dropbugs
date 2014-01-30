/// <reference path="app.ts" />

module DropBugs
{
    export function setUpSignalR() {
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
} 