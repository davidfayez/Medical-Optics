using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Favorite.Diagnose.Commands.Create;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Application.Favorite.Diagnose.Commands.Create;
public class CreateFavoriteDiagnoseCommand : AuditableEntity, IRequest<bool>, IMapFrom<FavoriteDiagnose>
{
    public int? Id { get; set; }
    public string? FavoriteName { get; set; }
    public string? Description { get; set; }
    public List<int>? SelectedIds { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<FavoriteDiagnose, CreateFavoriteDiagnoseCommand>()
                .ForMember(des => des.SelectedIds, opt => opt.MapFrom(src => src.FavoriteDiagnoseItems.Where(s => !s.IsDeleted).Select(s => s.DiagnoseId).ToList()))
               .ReverseMap();
    }
}

public class CreateFavoriteDiagnoseCommandHandler : IRequestHandler<CreateFavoriteDiagnoseCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateFavoriteDiagnoseCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreateFavoriteDiagnoseCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var favoriteDiagnose = _mapper.Map<FavoriteDiagnose>(request);
            var FavoriteDiagnoseItems = new List<FavoriteDiagnoseItem>();

            if (request.Id != null)
            {
                var DiagnoseItemsInDb = _applicationDbContext.FavoriteDiagnoseItems
                                                             .Where(s => !s.IsDeleted && s.FavoriteDiagnoseId == request.Id);
                //.Select(s=>s.DiagnoseId);

                var DiagnosesIdsinDB = DiagnoseItemsInDb.Select(s => s.DiagnoseId).ToList();
                var RemovedIds = DiagnosesIdsinDB.Except(request.SelectedIds);
                var InsertedIds = request.SelectedIds.Except(DiagnosesIdsinDB);
                request.SelectedIds = InsertedIds.ToList();
                _applicationDbContext.FavoriteDiagnoseItems.RemoveRange(DiagnoseItemsInDb.Where(s => RemovedIds.Contains(s.DiagnoseId)));

                request.SelectedIds.ForEach(id => FavoriteDiagnoseItems.Add(new FavoriteDiagnoseItem
                {
                    DiagnoseId = id
                }));

                favoriteDiagnose.FavoriteDiagnoseItems = FavoriteDiagnoseItems;
                _applicationDbContext.FavoriteDiagnoses.Update(favoriteDiagnose);
            }
            else
            {
                request.SelectedIds.ForEach(id => FavoriteDiagnoseItems.Add(new FavoriteDiagnoseItem
                {
                    DiagnoseId = id
                }));

                favoriteDiagnose.FavoriteDiagnoseItems = FavoriteDiagnoseItems;
                _applicationDbContext.FavoriteDiagnoses.Add(favoriteDiagnose);
            }

            await _applicationDbContext.SaveChangesAsync(cancellationToken);
            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            return await Task.FromResult(false);
            //throw;
        }

    }
}

