using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KatanaBugTracker.Models
{
    public interface IBugsRepository
    {
        IEnumerable<Bug> GetBugs();
        Bug GetBugById(int id);
    }
}