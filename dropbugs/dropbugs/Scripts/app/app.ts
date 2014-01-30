/// <reference path="../typings/signalr/signalr.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="draganddroputility.ts" />
/// <reference path="signalrsetup.ts" />
/// <reference path="viewmodel.ts" />

module DropBugs
{
    export var viewModel : ViewModel;

    $(() => {
        setUpSignalR();

        viewModel = new ViewModel();
        viewModel.init();
    });
}