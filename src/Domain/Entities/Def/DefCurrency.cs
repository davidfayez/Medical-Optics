using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Medical_Optics.Domain.Entities.Def;

    [Table("DefCurrency")]
    public class DefCurrency : AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Code { get; set; }
        [Required]
        [StringLength(100)]
        public string CurrencyNameAr { get; set; }
        [Required]
        [StringLength(100)]
        public string CurrencyNameEn { get; set; }

        [Required]
        [StringLength(100)]
        public string AbbreviationAr { get; set; }
        [Required]
        [StringLength(100)]
        public string AbbreviationEn { get; set; }

        [Required]
        public bool IsPimary { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DefaultFactor { get; set; }
        [StringLength(1000)]
        public string? Notes { get; set; }
       
        public int? DefBranchId { get; set; }
        public virtual DefBranch DefBranch { get; set; }
    }

