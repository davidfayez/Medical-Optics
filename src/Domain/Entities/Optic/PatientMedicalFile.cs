using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Domain.Entities.Optic;
public class PatientMedicalFile : AuditableEntity
{
    public int Id { get; set; }
    public int ClientId { get; set; }            
    public virtual CustomerData Client { get; set; }
    public virtual IList<PatientComplaint> PatientComplaints { get; set; }
}
