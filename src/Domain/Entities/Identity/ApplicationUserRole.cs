using ERP.DAL.Domains.Def;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ERP.DAL.Domains.Authentication
{
    
    [Table("AspNetUserRoles")]
    public class ApplicationUserRole : IdentityUserRole<string>
    {
        public int DefBranchId { get; set; }
        public virtual DefBranch DefBranch { get; set; }
    }
}
