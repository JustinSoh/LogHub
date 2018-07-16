using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogHubWebAPI.Models
{
    public class User
    {
        public string UserId { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
