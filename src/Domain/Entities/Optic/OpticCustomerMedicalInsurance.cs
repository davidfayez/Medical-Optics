
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Medical_Optics.Domain.Entities.Optic;

[Table("CustomerMedicalInsurance")] // التامين الطبى للعميل
public class CustomerMedicalInsurance : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int ClientId { get; set; }            // رقم العميل

    //============================================================================ General Information

    [Required, StringLength(50)]
    public string InsuranceName { get; set; }          //اسم شركة التأمين

    [Required, StringLength(50)]
    public string CardNumber { get; set; }           //رقم بطاقة التأمين

    [Required, StringLength(50)]
    public string ClassType { get; set; }         //نوع الفئة
    public DateTime DateIssued { get; set; }     //تاريخ الاصدار
    public DateTime DateExpiry { get; set; }    //تاريخ الانتهاء

    [StringLength(100)]
    public string CardPath { get; set; }      //صورة كارت التامين

    [StringLength(1000)]
    public string Description { get; set; }
    public virtual CustomerData Client { get; set; }
}
