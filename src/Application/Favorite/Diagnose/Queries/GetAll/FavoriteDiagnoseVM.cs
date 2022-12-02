using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Favorite.Diagnose.Queries.GetAll;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Application.Favorite.Diagnose.Queries.GetAll;
public class FavoriteDiagnoseVM : AuditableEntity, IMapFrom<FavoriteDiagnose>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<FavoriteDiagnose, FavoriteDiagnoseVM>()
                .ForMember(des => des.ItemsIds, opt => opt.MapFrom(src => src.FavoriteDiagnoseItems.Where(s => !s.IsDeleted).Select(s => s.Id).ToList()))
               .ReverseMap();
    }
    public int Id { get; set; }
    public string? FavoriteName { get; set; }
    public string? Description { get; set; }
    public List<int>? ItemsIds { get; set; }

}