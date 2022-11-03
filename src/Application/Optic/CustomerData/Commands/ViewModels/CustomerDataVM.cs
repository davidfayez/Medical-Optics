using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore;
using DB = Medical_Optics.Domain.Entities.Optic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
public class CustomerDataVM : AuditableEntity, IMapFrom<DB.CustomerData>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<CustomerDataVM, DB.CustomerData>()
               .ReverseMap();
    }
    public CustomerDataVM()
    {
        Nationalities = new List<SelectListItem>();
        Religiones = new List<SelectListItem>();
        SocialStatuses = new List<SelectListItem>();
        IDTypes = new List<SelectListItem>();
    }
    public int Id { get; set; }
    public string CustomerMRN { get; set; }                                   // كود العميل --unique
    public string CustomerFileNo { get; set; }                              // رقم ملف العميل
    public string CustomerNameAr { get; set; }                            // اسم العميل عربى
    public string CustomerNameEn { get; set; }                          // اسم العميل انجليزى
    public string FatherName { get; set; }                            // اسم الاب
    public string FamilyName { get; set; }                         // اسم العائلة
    public DateTime? BirthDate { get; set; }                      // تاريخ الميلاد
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
    public string? ImageUrl { get; set; }// صورة العميل 
    public string? Description { get; set; }    // ملاحظات
    public IFormFile CustomerImage { get; set; }
    public List<SelectListItem> Nationalities { get; set; }
    public List<SelectListItem> Religiones { get; set; }
    public List<SelectListItem> SocialStatuses { get; set; }
    public List<SelectListItem> IDTypes { get; set; }


}
