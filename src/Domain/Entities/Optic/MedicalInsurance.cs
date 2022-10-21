using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

public class MedicalInsurance : AuditableEntity
{
    public int Id { get; set; }
    public int ClientId { get; set; }            // رقم العميل
    public string InsuranceCompanyName { get; set; }          //اسم شركة التأمين
    public string CardNumber { get; set; }           //رقم بطاقة التأمين
    public string ClassType { get; set; }         //نوع الفئة
    public DateTime? DateIssued { get; set; }     //تاريخ الاصدار
    public DateTime? DateExpiry { get; set; }    //تاريخ الانتهاء
    public string CardImageUrl { get; set; }      //صورة كارت التامين
    public string Description { get; set; }
    public virtual CustomerData Client { get; set; }
}
