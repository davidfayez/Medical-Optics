using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.Diagnose.Queries.GetAll;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Optic.DefCountry.Queries.GetAll;
public class DefCountryVM: AuditableEntity,IMapFrom<DB.DefCountry>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<DefCountryVM, DB.DefCountry>()
               .ReverseMap();
    }
    public int Id { get; set; }
    public string CountryCode { get; set; }
    public string CountryNameAr { get; set; }
    public string CountryNameEn { get; set; }
    public string CapitalNameAr { get; set; }
    public string CapitalNameEn { get; set; }
    public string Description { get; set; }
}
