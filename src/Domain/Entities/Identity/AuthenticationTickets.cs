using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ERP.DAL.Domains.Authentication
{
    public class AuthenticationTickets
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public AspNetUser User { get; set; }

        public byte[] Value { get; set; }

        public DateTimeOffset? LastActivity { get; set; }

        public DateTimeOffset? Expires { get; set; }
    }
}
