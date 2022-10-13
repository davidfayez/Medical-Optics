
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ERP.DAL.Domains.Def;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Domain.Entities.Optic;

[Table("CustomerData")]    // بيانات العميل الاساسية
public class OpticCustomerData : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information

    [Required, StringLength(30)]
    public string CustomerMRN { get; set; }                                   // كود العميل --unique

    [Required, StringLength(30)]
    public string CustomerFileNo { get; set; }                              // رقم ملف العميل

    [Required, StringLength(100)]
    public string CustomerNameAr { get; set; }                            // اسم العميل عربى

    [Required, StringLength(100)]
    public string CustomerNameEn { get; set; }                          // اسم العميل انجليزى

    [Required, StringLength(30)]
    public string FatherName { get; set; }                            // اسم الاب

    [Required, StringLength(30)]
    public string FamilyName { get; set; }                         // اسم العائلة

    [Required]
    public DateTime BirthDate { get; set; }                      // تاريخ الميلاد

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public string Age { get; set; }                            // العمر -- يتم احتسابة تلقائى

    [Required, StringLength(50)]
    public string IDType { get; set; }                       //نوع الهوية 

    [Required, StringLength(50)]
    public string IDNumber { get; set; }                   //رقم الاقامة / الهوية الوطنية 

    [Required, StringLength(50)]
    public string Telephone { get; set; }                // التليفون

    [Required, StringLength(50)]
    public string Mobile { get; set; }                 // الموبيل

    [Required, StringLength(100)]
    public string Email { get; set; }                // البريد الالكترونى

    [Required]
    public int? Gender { get; set; }               // الجنس
    public int? NationalityId { get; set; }    //الجنسية           Table = Def / DefNationality
    public int? ReligionId { get; set; }   // الديانة           Table = Def / DefReligion

    [Required, StringLength(350)]
    public string CustomerPhotoPath { get; set; }// صورة العميل 

    [StringLength(500)]
    public string Description { get; set; }    // ملاحظات

    //public int? FK_DefBranchId { get; set; }      // اسم الفرع


    public virtual DefNationality Nationality { get; set; }
    public virtual DefReligion Religion { get; set; }

    //[ForeignKey("FK_SocialStatusId")]
    //public virtual HrSocialStatus HrSocialStatus { get; set; }

}
