using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Diagnose.Queries.GetAll;

namespace Medical_Optics.Application.Favorite.Diagnose.Queries.GetDiagnosisByFavoriteId;
public class GetDiagnosisByFavoriteIdQuery : IRequest<List<DiagnoseVM>>
{
    public int FavoriteId { get; set; }
}

public class GetDiagnosisByFavoriteIdQueryHandler : IRequestHandler<GetDiagnosisByFavoriteIdQuery, List<DiagnoseVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetDiagnosisByFavoriteIdQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<DiagnoseVM>> Handle(GetDiagnosisByFavoriteIdQuery request, CancellationToken cancellationToken)
    {
        var FavoriteDiagnoses = _applicationDbContext.FavoriteDiagnoses
                                              .Include(s => s.FavoriteDiagnoseItems)
                                              .ThenInclude(s => s.Diagnose)
                                              .FirstOrDefault(s => s.Id == request.FavoriteId);

        var Diagnoses = FavoriteDiagnoses?.FavoriteDiagnoseItems
                                            .Where(s => !s.IsDeleted)
                                            .Select(s => s.Diagnose);

        var DiagnoseVMs = _mapper.Map<List<DiagnoseVM>>(Diagnoses.ToList());
        return Task.FromResult(DiagnoseVMs);
    }
}

