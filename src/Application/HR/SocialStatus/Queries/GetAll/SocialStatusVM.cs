using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Def.City.Queries.GetAll;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;
using Medical_Optics.Domain.Entities.HR;

namespace Medical_Optics.Application.HR.SocialStatus.Queries.GetAll;
public class SocialStatusVM : AuditableEntity, IMapFrom<HrSocialStatus>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<SocialStatusVM, HrSocialStatus>()
               .ReverseMap();
    }

    public int Id { get; set; }
    public string TypeCode { get; set; }
    public string TypeNameAr { get; set; }
    public string TypeNameEn { get; set; }
    public string Description { get; set; }
}
