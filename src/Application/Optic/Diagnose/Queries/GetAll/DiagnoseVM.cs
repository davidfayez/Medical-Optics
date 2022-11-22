using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Diagnose.Queries.GetAll;
public class DiagnoseVM: AuditableEntity,IMapFrom<DB.Diagnose>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<DB.Diagnose, DiagnoseVM>()
               .ForMember(des => des.CodeAndName, opt => opt.MapFrom(src => src.DiagnoseCode + " - " + src.DiagnoseNameEn))
               .ReverseMap();
    }
    public int Id { get; set; }
    public string DiagnoseCode { get; set; }
    public string CodeAndName { get; set; }
    public string DiagnoseNameAr { get; set; }
    public string DiagnoseNameEn { get; set; }
    public string Description { get; set; }
}
