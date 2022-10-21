
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ERP.DAL.Domains.Def;
using Medical_Optics.Domain.Entities.Def;
using Medical_Optics.Domain.Entities.HR;

namespace Medical_Optics.Domain.Entities.Optic;

public class CustomerData : AuditableEntity
{
    public int Id { get; set; }
    public string CustomerMRN { get; set; }                                   // كود العميل --unique
    public string CustomerFileNo { get; set; }                              // رقم ملف العميل
    public string CustomerNameAr { get; set; }                            // اسم العميل عربى
    public string CustomerNameEn { get; set; }                          // اسم العميل انجليزى
    public string FatherName { get; set; }                            // اسم الاب
    public string FamilyName { get; set; }                         // اسم العائلة
    public DateTime BirthDate { get; set; }                      // تاريخ الميلاد
    public int Age { get; set; }                            // العمر -- يتم احتسابة تلقائى
    public int IDType { get; set; }                       //نوع الهوية 
    public int PayType { get; set; } // cash , credit
    public string IDNumber { get; set; }                   //رقم الاقامة / الهوية الوطنية 
    public string Phone { get; set; }                // التليفون
    public string Mobile { get; set; }                 // الموبيل
    public string Email { get; set; }                // البريد الالكترونى
    public int? Gender { get; set; }               // الجنس
    public int? NationalityId { get; set; }    //الجنسية           Table = Def / DefNationality
    public int? ReligionId { get; set; }   // الديانة           Table = Def / DefReligion
    public int? SocialStatusId { get; set; }   // الحالة الاجتماعية           Table = Def / DefReligion
    public string ImageUrl { get; set; }// صورة العميل 
    public string Description { get; set; }    // ملاحظات

    public virtual DefNationality Nationality { get; set; }
    public virtual DefReligion Religion { get; set; }
    public virtual HrSocialStatus SocialStatus { get; set; }
    public virtual NationalAddress NationalAddress { get; set; }
    public virtual MedicalInsurance MedicalInsurance { get; set; }

}
