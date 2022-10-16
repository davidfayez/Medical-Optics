using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Nationality.Queries.GetAll;
public class NationalityVM: AuditableEntity,IMapFrom<DefNationality>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<NationalityVM, DefNationality>()
               .ReverseMap();
    }
    public int Id { get; set; }
    public string NationalityCode { get; set; }
    public string NationalityNameAr { get; set; }
    public string NationalityNameEn { get; set; }
    public string Description { get; set; }
    public int? DefBranchId { get; set; }
}
