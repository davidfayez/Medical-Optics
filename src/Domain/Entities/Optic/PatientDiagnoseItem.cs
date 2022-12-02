using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Domain.Entities.Optic;
public class PatientDiagnoseItem : AuditableEntity
{
    public int Id { get; set; }
    public int DiagnoseTypeId { get; set; }
    public int DiagnoseId { get; set; }
    public int PatientDiagnoseId { get; set; }
    public virtual Diagnose Diagnose { get; set; }
    public virtual PatientDiagnose PatientDiagnose { get; set; }

}
