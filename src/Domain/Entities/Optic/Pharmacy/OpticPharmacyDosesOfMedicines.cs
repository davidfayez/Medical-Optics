
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic.Pharmacy;

[Table("OpticPharmacyDosesOfMedicines")]    // جرعات الأدوية
public class OpticPharmacyDosesOfMedicines : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int FK_PharmacyDrug { get; set; }            // رقم اسم الدواء

    //============================================================================ General Information

    [Required, StringLength(300)]
    public string DoseNameEn { get; set; }          // اسم الدواء انجليزى

    [Required, StringLength(300)]
    public string DoseNameAr { get; set; }        // اسم الدواء عربى

    [StringLength(10)]
    public int Times { get; set; }              // عدد المرات
    public int Per { get; set; }               // ( تحديد الفترة الزمينة كل ( يوم / اسبوع - شهر
    public int QTYDose { get; set; }          // عدد الجرعات

    [StringLength(500)]
    public string Description { get; set; }

}
