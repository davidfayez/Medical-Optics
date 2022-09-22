using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ERP.DAL.Domains.Authentication
{
    
    [Table("AspNetRoles")]
    public class ApplicationRole : IdentityRole
    {
        public ApplicationRole() : base() { }
        public ApplicationRole(string name, string NameAr, int Order) : base(name)
        {
            this.NameAr = NameAr;
            this.Order = Order;
        }
        public virtual string NameAr { get; set; }
        public virtual int Order { get; private set; }

    }
}
