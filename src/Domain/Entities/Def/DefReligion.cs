using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERP.DAL.Domains.Def
{
    [Table("DefReligion")]
    public class DefReligion : AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string ReligionCode { get; set; }
        [Required]
        [StringLength(100)]
        public string ReligionNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string ReligionNameEn { get; set; }
        [StringLength(1000)]
        public string Description { get; set; }
    }
}
