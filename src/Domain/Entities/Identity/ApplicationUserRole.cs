using Medical_Optics.Domain.Entities.Def;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Identity;

[Table("AspNetUserRoles")]
public class ApplicationUserRole : IdentityUserRole<string>
{
    public int DefBranchId { get; set; }
    public virtual DefBranch DefBranch { get; set; }
}

