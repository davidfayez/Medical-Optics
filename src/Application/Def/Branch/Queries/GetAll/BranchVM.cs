using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;
using Microsoft.AspNetCore.Http;

namespace Medical_Optics.Application.Def.Branch.Queries.GetAll;
public class BranchVM :AuditableEntity,IMapFrom<DefBranch>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<BranchVM, DefBranch>()
               .ReverseMap();
    }


    public int Id { get; set; }
    public string BranchCode { get; set; }
    public string BranchNameAr { get; set; }
    public string BranchNameEn { get; set; }
    public int DefCompanyId { get; set; }
    public string BranchAddress { get; set; }
    public string Phone1 { get; set; }
    public string Phone2 { get; set; }
    public string Phone3 { get; set; }
    public string Email { get; set; }
    public string Fax { get; set; }
    public string Fax2 { get; set; }
    public string Fax3 { get; set; }
    public string PostCode { get; set; }
    public string Notes { get; set; }
    public string LogoUrl { get; set; }
    public int? DefCountryId { get; set; }
    public int? DefCityId { get; set; }
    public int? DefBranchId { get; set; }
    public string CommercialRegister { get; set; }
    public string TaxCard { get; set; }
    public string Website { get; set; }
    public IFormFile BranchImage { get; set; }

}
