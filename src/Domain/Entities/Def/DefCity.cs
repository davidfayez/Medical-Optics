using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Domain.Entities.Def;

    [Table("DefCity")]
    public class DefCity : AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string CityCode { get; set; }
        [Required]
        [StringLength(100)]
        public string CityNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string CityNameEn { get; set; }
        [Required]
        [StringLength(100)]
        public string GovernorateNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string GovernorateNameEn { get; set; }
        [StringLength(1000)]
        public int DefCountryId { get; set; }
        public string Description { get; set; }
        public virtual DefCountry DefCountry { get; set; }
    }

