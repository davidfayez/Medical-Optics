using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetById;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientComplaints;
public class PatientComplaintVM : AuditableEntity, IMapFrom<PatientComplaint>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<PatientComplaint, PatientDataVM>()
               .ReverseMap();
    }
    public int Id { get; set; }
    public int VisitNo { get; set; }
    public string ComplaintName { get; set; }
    public int PatientMedicalFileId { get; set; }
}
