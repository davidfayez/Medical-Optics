using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Optic;
using Enums = Medical_Optics.Application.Common.Enums;
namespace Medical_Optics.Application.Optic.PatientFile.Queries.GetById;
public class PatientDataVM : AuditableEntity, IMapFrom<DB.CustomerData>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<DB.CustomerData, PatientDataVM>()
               .ForMember(des => des.NationalityName, opt => opt.MapFrom(src => src.Nationality.NationalityNameEn))
               .ForMember(des => des.ReligionName, opt => opt.MapFrom(src => src.Religion.ReligionNameEn))
               .ForMember(des => des.SocialStatusName, opt => opt.MapFrom(src => src.SocialStatus.TypeNameEn))
               .ForMember(des => des.MedicalCode, opt => opt.MapFrom(src => src.MedicalInsurance.CardNumber))
               .ForMember(des => des.MedicalCompany, opt => opt.MapFrom(src => src.MedicalInsurance.InsuranceCompanyName))
               .ForMember(des => des.GenderName, opt => opt.MapFrom(src => Enum.GetName(typeof(Enums.Gender), src.Gender)))
               .ReverseMap();
    }

    public int Id { get; set; }
    public int VisitNo { get; set; }
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
    public string GenderName { get; set; }               // الجنس
    public int? NationalityId { get; set; }    //الجنسية           Table = Def / DefNationality
    public string NationalityName { get; set; }    //الجنسية           Table = Def / DefNationality
    public int? ReligionId { get; set; }   // الديانة           Table = Def / DefReligion
    public string ReligionName { get; set; }   // الديانة           Table = Def / DefReligion
    public int? SocialStatusId { get; set; }   // الحالة الاجتماعية           Table = Def / DefReligion
    public string SocialStatusName { get; set; }   // الحالة الاجتماعية           Table = Def / DefReligion
    public string? ImageUrl { get; set; }// صورة العميل 
    public string? MedicalImageUrl { get; set; }// صورة العميل 
    public string? Description { get; set; }    // ملاحظات
    public string? MedicalCode { get; set; }    
    public string? MedicalCompany { get; set; }    

}
