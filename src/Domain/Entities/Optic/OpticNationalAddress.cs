
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ERP.DAL.Domains.Def;

namespace Medical_Optics.Domain.Entities.Optic;

[Table("OpticNationalAddress")] // العنوان الوطنى الموحد
public class OpticNationalAddress : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int ClientId { get; set; }                 // رقم العميل التابع له العنوان

    //============================================================================ General Information

    [StringLength(30)]
    public string UnifiedNationalNumber { get; set; }   // الرقم الوطني الموحد

    [StringLength(30)]
    public string BuildingNumber { get; set; }       // رقم المبني

    [StringLength(100)]

    public string StreetName { get; set; }         // اسم الشارع

    [StringLength(50)]
    public string DistrictName { get; set; }     // اسم الحى

    public int? CityId { get; set; }      // اسم المدينة

    [StringLength(30)]
    public string PostalCode { get; set; }    // الرقم البريدى

    [StringLength(50)]
    public string ExtraNumber { get; set; } // الرقم الإضافي

    [StringLength(10)]
    public string UnitNumber { get; set; } // رقم الوحدة
    public virtual DefCity City { get; set; }
    public virtual OpticCustomerData Client { get; set; }


}
