
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

[Table("OpticMedicalFileDiagnosis")] // اضافة تشخيص العميل الى الملف الطبى 
public class OpticMedicalFileDiagnosis : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information

    public int ClientId { get; set; }            // رقم العميل

    [Required, StringLength(400)]
    public string DiagnosisName { get; set; }

    public int VisitNo { get; set; }             // رقم الزيارة

    [Required, StringLength(50)]
    public string DiagnosisCode { get; set; }

    public virtual CustomerData Client { get; set; }
}
