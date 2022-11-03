
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ERP.DAL.Domains.Def;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Domain.Entities.Optic;

public class NationalAddress : AuditableEntity
{
    public int Id { get; set; }
    public int ClientId { get; set; }                 // رقم العميل التابع له العنوان
    public string? UnifiedNationalNumber { get; set; }   // الرقم الوطني الموحد
    public string? BuildingNumber { get; set; }       // رقم المبني
    public string? StreetName { get; set; }         // اسم الشارع
    public string? DistrictName { get; set; }     // اسم الحى
    public int? CityId { get; set; }      // اسم المدينة
    public string? PostalCode { get; set; }    // الرقم البريدى
    public string? ExtraNumber { get; set; } // الرقم الإضافي
    public string? UnitNumber { get; set; } // رقم الوحدة
    public virtual DefCity City { get; set; }
    public virtual CustomerData Client { get; set; }
}
