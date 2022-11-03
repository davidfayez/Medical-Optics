using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.AspNetCore.Http;

namespace Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
public class MedicalInsuranceVM : /*AuditableEntity,*/ IMapFrom<MedicalInsurance>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<MedicalInsuranceVM, MedicalInsurance>()
               .ReverseMap();
    }
    public int? Id { get; set; }
    public int? ClientId { get; set; }            // رقم العميل
    public string? InsuranceCompanyName { get; set; }          //اسم شركة التأمين
    public string? CardNumber { get; set; }           //رقم بطاقة التأمين
    public string? ClassType { get; set; }         //نوع الفئة
    public DateTime? DateIssued { get; set; }     //تاريخ الاصدار
    public DateTime? DateExpiry { get; set; }    //تاريخ الانتهاء
    public string? CardImageUrl { get; set; }      //صورة كارت التامين
    public string? Description { get; set; }
    public IFormFile CardImage { get; set; }


}
