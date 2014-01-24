using Nancy;
using Nancy.Conventions;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace KatanaBugTracker
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Order is significant!

            // SignalR
            app.MapSignalR();

            // Web API
            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute("bugs", "api/{Controller}");
            app.UseWebApi(config);

            // Nancy
            app.UseNancy(options =>
            {
                options.Bootstrapper = new CustomBootstrapper();
            });
        }
    }

    public class CustomBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(Nancy.Conventions.NancyConventions nancyConventions)
        {
            base.ConfigureConventions(nancyConventions);

            Conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("scripts", "Scripts"));
            Conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("content", "Content"));
            Conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("fonts", "fonts"));
        }
    }
}