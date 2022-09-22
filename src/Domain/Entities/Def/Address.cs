using ERP.DAL.Domains.Def;
using Medical_Optics.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ERP.DAL.Domains.Def
{
    [Table("Address")]
    public class Address : AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [StringLength(350)]
        [Required]
        public string AddressAr { get; set; }
        [StringLength(350)]
        [Required]
        public string AddressEn { get; set; }

        public bool? IsDefaultAddress { get; set; }
        public bool? IsDeliveryAddress { get; set; }
       
        [StringLength(1000)]
        public string Description { get; set; }
        [Required]
        public int FK_ReferenceId { get; set; }
    }
}
