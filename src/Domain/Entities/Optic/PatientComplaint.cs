
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

public class PatientComplaint : AuditableEntity
{
    public int Id { get; set; }
    public int VisitNo { get; set; }
    public string ComplaintName { get; set; }
    public int PatientMedicalFileId { get; set; }
    public virtual PatientMedicalFile PatientMedicalFile { get; set; }
}
