
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

public class PatientDiagnose : AuditableEntity
{
    public int Id { get; set; }
    public int VisitNo { get; set; }

    [Required, StringLength(400)]
    public string DiagnoseName { get; set; }

    [Required, StringLength(50)]
    public string DiagnoseCode { get; set; }
    public int PatientMedicalFileId { get; set; }
    public virtual PatientMedicalFile PatientMedicalFile { get; set; }
}
