using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Domain.Entities.Def;

[Table("DefNationality")]
    public class DefNationality : AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string NationalityCode { get; set; }

        [Required]
        [StringLength(100)]
        public string NationalityNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string NationalityNameEn { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int? DefBranchId { get; set; }
        public virtual DefBranch DefBranch { get; set; }
        public virtual IList<CustomerData> CustomersData { get; set; }


}

