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

namespace Medical_Optics.Application.Def.City.Queries.GetAll;
public class CityVM : AuditableEntity, IMapFrom<DefCity>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<CityVM, DefCity>()
               .ReverseMap();
    }
    public int Id { get; set; }
    public string CityCode { get; set; }
    public string CityNameAr { get; set; }
    public string CityNameEn { get; set; }
    public string GovernorateNameAr { get; set; }
    public string GovernorateNameEn { get; set; }
    public int DefCountryId { get; set; }
    public string Description { get; set; }
}
