using ERP.DAL.Domains.Def;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERP.DAL.Domains.Authentication
{
    [Table("AspNetUserRolesCustom")]
    public class AspNetUserRolesCustom
    {

        [Key]
        [StringLength(128)]
        public string UserId { get; set; }

        [StringLength(128)]
        public string RoleId { get; set; }
      
        public int DefBranchId { get; set; }
        public virtual DefBranch DefBranch { get; set; }
    }
}
