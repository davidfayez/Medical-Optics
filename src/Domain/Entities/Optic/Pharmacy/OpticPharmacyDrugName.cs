
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic.Pharmacy;

[Table("OpticPharmacyDrugName")]          // اسماء الادوية
public class OpticPharmacyDrugName : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information
    [Required, StringLength(50)]
    public string Barcode { get; set; }                           // باركود الدواء

    [Required, StringLength(50)]
    public string ContractCode { get; set; }                    // باركود الدواء

    [Required, StringLength(300)]
    public string DrugNameEn { get; set; }                    // اسم الدواء انجليزى

    [Required, StringLength(300)]
    public string DrugNameAr { get; set; }                  // اسم الدواء عربى

    [Required, StringLength(10)]
    public string ItemLocation { get; set; }              // مكان تخزين الدواء على الرف

    [Required, StringLength(10)]
    public int Margen { get; set; }                     // حد الطلب

    [StringLength(300)]
    public string ScientificArticle { get; set; }     // الاسم العلمى

    [StringLength(300)]
    public string ScientificName { get; set; }     // الاسم العلمى

    [StringLength(30)]
    public string RegNoOfMOH { get; set; }      // الرقم في وزارة الصحة

    [StringLength(30)]
    public string GTINCode { get; set; }     // الرقم في وزارة الصحة

    [StringLength(500)]
    public string Description { get; set; }

}
