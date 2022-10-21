using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Domain.Entities.HR;
[Table("HrSocialStatus")]//الحالة الاجتماعية
public class HrSocialStatus : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    [StringLength(50)]
    public string TypeCode { get; set; }
    [Required]
    [StringLength(100)]
    public string TypeNameAr { get; set; }
    [Required]
    [StringLength(100)]
    public string TypeNameEn { get; set; }
    [StringLength(1000)]
    public string Description { get; set; }
    
}
