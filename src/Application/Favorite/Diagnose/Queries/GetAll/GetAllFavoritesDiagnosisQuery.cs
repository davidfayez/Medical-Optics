using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Favorite.Diagnose.Queries.GetAll;

namespace Medical_Optics.Application.Favorite.Diagnose.Queries.GetAll;
public class GetAllFavoritesDiagnosisQuery : IRequest<List<FavoriteDiagnoseVM>>
{

}

public class GetAllFavoritesDiagnosisQueryHandler : IRequestHandler<GetAllFavoritesDiagnosisQuery, List<FavoriteDiagnoseVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllFavoritesDiagnosisQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<FavoriteDiagnoseVM>> Handle(GetAllFavoritesDiagnosisQuery request, CancellationToken cancellationToken)
    {
        var FavoriteDiagnoses = _applicationDbContext.FavoriteDiagnoses
                                                      .Include(s => s.FavoriteDiagnoseItems)
                                                      .Where(s => !s.IsDeleted);

        var FavoriteDiagnosesVMs = _mapper.Map<List<FavoriteDiagnoseVM>>(FavoriteDiagnoses.ToList());
        return Task.FromResult(FavoriteDiagnosesVMs);
    }
}