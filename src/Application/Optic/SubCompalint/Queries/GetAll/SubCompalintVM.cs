using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.SubCompalint.Queries.GetAll;
public class SubCompalintVM : AuditableEntity,IRequest<SubCompalintVM>,IMapFrom<DB.SubComplaint>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<SubCompalintVM, DB.SubComplaint>()
            .ReverseMap();
    }
    public int Id { get; set; }
    public int ComplaintId { get; set; }             // الشكوى الرئيسية
    public string SubComplaintCode { get; set; }
    public string SubComplaintNameAr { get; set; }
    public string SubComplaintNameEn { get; set; }
    public string SubComplaintPhotoPath { get; set; } // صورة الشكوى 
    public string Description { get; set; }
}
