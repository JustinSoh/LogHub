using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogHubWebAPI.Models
{
    public class OverallBandwidth
    {
        public string OverallBandwidthId { get; set; }
        public string Bandwith { get; set; }
        public DateTime Time { get; set; }
        public Boolean Included { get; set; }

    }
}
