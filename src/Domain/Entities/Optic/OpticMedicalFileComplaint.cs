
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

[Table("OpticMedicalFileComplaint")]
public class OpticMedicalFileComplaint : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information

    public int ClientId { get; set; }            // رقم العميل

    [Required, StringLength(300)]
    public string ComplaintName { get; set; }

    public int VisitNo { get; set; }             // رقم الزيارة

    [StringLength(500)]
    public string Description { get; set; }


    public virtual CustomerData Client { get; set; }
}
