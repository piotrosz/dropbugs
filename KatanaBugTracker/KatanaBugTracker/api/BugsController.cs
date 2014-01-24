using System;
using System.Collections.Generic;
using System.Linq;
using KatanaBugTracker.Models;
using System.Web.Http;
using KatanaBugTracker.Hubs;
using Microsoft.AspNet.SignalR;

namespace KatanaBugTracker.Api
{
    [RoutePrefix("api/bugs")]
    public class BugsController : ApiController
    {
        IBugsRepository _bugsRepository = new BugsRepository();
        IHubContext _hub;

        public BugsController()
        {
            _hub = GlobalHost.ConnectionManager.GetHubContext<BugHub>();
        }

        public IEnumerable<Bug> Get()
        {
            return _bugsRepository.GetBugs();
        }
        
        [Route("backlog")]
        public Bug MoveToBacklog([FromBody] int id)
        {
            return MoveBug(id, BugState.Backlog);
        }

        [Route("working")]
        public Bug MoveToWorking([FromBody] int id)
        {
            return MoveBug(id, BugState.Working);
        }

        [Route("done")]
        public Bug MoveToDone([FromBody] int id)
        {
            return MoveBug(id, BugState.Done);
        }

        private Bug MoveBug(int id, BugState bugState)
        {
            var bug = _bugsRepository.GetBugById(id);
            bug.State = bugState;
            _hub.Clients.All.moved(bug);
            return bug;
        }
    }
}