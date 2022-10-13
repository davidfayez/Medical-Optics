using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Optic.DefReligion.Queries.GetAll;
public class DefReligionVM: AuditableEntity, IMapFrom<DB.DefReligion>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<DefReligionVM, DB.DefReligion>()
               .ReverseMap();
    }
    public int Id { get; set; }
    public string ReligionCode { get; set; }
    public string ReligionNameAr { get; set; }
    public string ReligionNameEn { get; set; }
    public string Description { get; set; }
}
