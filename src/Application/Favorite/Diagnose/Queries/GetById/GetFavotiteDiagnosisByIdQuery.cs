using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Favorite.Diagnose.Queries.GetById;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Application.Favorite.Diagnose.Queries.GetById;
public class GetFavotiteDiagnosisByIdQuery : IRequest<FavoriteDiagnose>
{
    public int Id { get; set; }
}

public class GetFavotiteDiagnosisByIdQueryHandler : IRequestHandler<GetFavotiteDiagnosisByIdQuery, FavoriteDiagnose>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetFavotiteDiagnosisByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<FavoriteDiagnose> Handle(GetFavotiteDiagnosisByIdQuery request, CancellationToken cancellationToken)
    {
        var FavoriteDiagnose = _applicationDbContext.FavoriteDiagnoses.Include(s => s.FavoriteDiagnoseItems)
                                                                        .FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (FavoriteDiagnose != null)
            return Task.FromResult(FavoriteDiagnose);
        else
            return Task.FromResult(new FavoriteDiagnose());

    }


}