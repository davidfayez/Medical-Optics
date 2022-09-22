using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace ERP.DAL.Domains.Def
{
    [Table("Attachment")]
    public class Attachment : AuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [StringLength(350)]
        [Required]
        public string FileName { get; set; }
        [StringLength(350)]
        [Required]
        public string FilePath { get; set; }
        [StringLength(1000)]
        public string Description { get; set; }
        public int FK_ReferenceId { get; set; }
    }
}
