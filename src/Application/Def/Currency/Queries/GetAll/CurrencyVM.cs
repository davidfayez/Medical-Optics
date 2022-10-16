using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using ERP.DAL.Domains.Def;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
using Medical_Optics.Domain.Common;

namespace Medical_Optics.Application.Def.Currency.Queries.GetAll;
public class CurrencyVM : AuditableEntity, IMapFrom<DefCurrency>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<CurrencyVM, DefCurrency>()
               .ReverseMap();
    }
    public int Id { get; set; }
    public string Code { get; set; }
    public string CurrencyNameAr { get; set; }
    public string CurrencyNameEn { get; set; }
    public string AbbreviationAr { get; set; }
    public string AbbreviationEn { get; set; }
    public bool IsPimary { get; set; }
    public decimal DefaultFactor { get; set; }
    public string? Notes { get; set; }
    public int? DefBranchId { get; set; }
}
