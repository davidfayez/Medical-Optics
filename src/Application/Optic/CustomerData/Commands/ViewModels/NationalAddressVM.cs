using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
public class NationalAddressVM : /*AuditableEntity,*/ IMapFrom<NationalAddress>
{
    public NationalAddressVM()
    {
        //Cities = new List<SelectListItem>();
    }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<NationalAddressVM, NationalAddress>()
               .ReverseMap();
    }
    public int? Id { get; set; }
    public int? ClientId { get; set; }                 // رقم العميل التابع له العنوان
    public string? UnifiedNationalNumber { get; set; }   // الرقم الوطني الموحد
    public string? BuildingNumber { get; set; }       // رقم المبني
    public string? StreetName { get; set; }         // اسم الشارع
    public string? DistrictName { get; set; }     // اسم الحى
    public int? CityId { get; set; }      // اسم المدينة
    public string? PostalCode { get; set; }    // الرقم البريدى
    public string? ExtraNumber { get; set; } // الرقم الإضافي
    public string? UnitNumber { get; set; } // رقم الوحدة
    //public List<SelectListItem> Cities { get; set; }

}
