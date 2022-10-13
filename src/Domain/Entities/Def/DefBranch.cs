using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Medical_Optics.Domain.Entities.Def;

namespace ERP.DAL.Domains.Def
{
    [Table("DefBranch")]
    public class DefBranch : AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string BranchCode { get; set; }

        [Required]
        [StringLength(100)]
        public string BranchNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string BranchNameEn { get; set; }

        public int DefCompanyId { get; set; }

        [Required]
        [StringLength(100)]
        public string BranchAddress { get; set; }

        [StringLength(50)]
        public string Phone1 { get; set; }

        [StringLength(50)]
        public string Phone2 { get; set; }

        [StringLength(50)]
        public string Phone3 { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(50)]
        public string Fax { get; set; }

        [StringLength(50)]
        public string Fax2 { get; set; }

        [StringLength(50)]
        public string Fax3 { get; set; }

        [StringLength(50)]
        public string PostCode { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }
        public string LogoUrl { get; set; }
        public int? DefCountryId { get; set; }
        public int? DefCityId { get; set; }
        [StringLength(50)]
        public string CommercialRegister { get; set; }
        [StringLength(50)]
        public string TaxCard { get; set; }
        [StringLength(50)]
        public string Website { get; set; }

        public virtual DefCountry DefCountry { get; set; }
        public virtual DefCity DefCity { get; set; }
        public virtual DefCompany DefCompany { get; set; }
    }
}

