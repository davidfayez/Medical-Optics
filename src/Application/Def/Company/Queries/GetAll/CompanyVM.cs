using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Def.Company.Queries.GetAll;
public class CompanyVM: AuditableEntity, IMapFrom<DB.DefCompany>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<CompanyVM, DB.DefCompany>()
               .ReverseMap();
    }

    public int Id { get; set; }
    public string CompanyNameAr { get; set; }
    public string CompanyNameEn { get; set; }
    public string CompanyAddress { get; set; }
    public string Phone1 { get; set; }
    public string Phone2 { get; set; }
    public string Phone3 { get; set; }
    public string Email { get; set; }
    public string Fax { get; set; }
    public string PostCode { get; set; }
    public string Website { get; set; }
    public string LogoUrl { get; set; }
    public DateTime FinancialYearStart { get; set; }
    public DateTime FinancialYearEnd { get; set; }
    public string Notes { get; set; }
    public string CommercialRegister { get; set; }
    public string Location { get; set; }
    public string TaxCard { get; set; }
}
