using KatanaBugTracker.ViewModels;
using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KatanaBugTracker
{
    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = x =>
            {
                var model = new HomeViewModel { Title = "Bugs drag & drop" };
                return View["home", model];
            };
        }
    }
}