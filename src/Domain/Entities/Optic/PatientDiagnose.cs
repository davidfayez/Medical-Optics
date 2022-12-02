
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Domain.Entities.Optic;

public class PatientDiagnose : AuditableEntity
{
    public int Id { get; set; }
    public int VisitNo { get; set; }
    public int PatientMedicalFileId { get; set; }
    public virtual PatientMedicalFile PatientMedicalFile { get; set; }
    public virtual IList<PatientDiagnoseItem> PatientDiagnoseItems { get; set; }

}
