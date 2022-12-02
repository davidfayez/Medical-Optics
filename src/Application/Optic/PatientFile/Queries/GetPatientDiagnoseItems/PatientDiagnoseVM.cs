using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientComplaints;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientDiagnosis;
public class PatientDiagnoseVM : AuditableEntity, IMapFrom<PatientDiagnose>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<PatientDiagnose, PatientDiagnoseVM>()
               .ReverseMap();
    }
    public int Id { get; set; }
    public int ClientId { get; set; }
    public int VisitNo { get; set; }
    public int PatientMedicalFileId { get; set; }
    public List<PatientDiagnoseItemVM> PatientDiagnoseItemsVM { get; set; }

}

public class PatientDiagnoseItemVM : AuditableEntity, IMapFrom<PatientDiagnoseItem>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<PatientDiagnoseItem, PatientDiagnoseItemVM>()
               .ForMember(des => des.DiagnoseCode, opt => opt.MapFrom(src => src.Diagnose.DiagnoseCode))
               .ForMember(des => des.DiagnoseName, opt => opt.MapFrom(src => src.Diagnose.DiagnoseNameEn))
               .ForMember(des => des.CodeAndName, opt => opt.MapFrom(src => src.Diagnose.DiagnoseCode + " - " + src.Diagnose.DiagnoseNameEn));

        profile.CreateMap<PatientDiagnoseItemVM, PatientDiagnoseItem>();
    }
    public int Id { get; set; }
    public int DiagnoseTypeId { get; set; }
    public int DiagnoseId { get; set; }
    public int DiagnoseCode { get; set; }
    public int DiagnoseName { get; set; }
    public int CodeAndName { get; set; }
    public int PatientDiagnoseId { get; set; }
}

