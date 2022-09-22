using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ERP.DAL.Domains.Def
{
    [Table("DefCountry")]
    public class DefCountry :AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string CountryCode { get; set; }

        [Required]
        [StringLength(100)]
        public string CountryNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string CountryNameEn { get; set; }

        [Required]
        [StringLength(100)]
        public string CapitalNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string CapitalNameEn { get; set; }


        [StringLength(1000)]
        public string Description { get; set; }
    }
}
