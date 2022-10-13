using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.City.Queries.GetById;

namespace Medical_Optics.Application.Def.City.Queries.GetById;
public class GetCityByIdQuery : IRequest<DefCity>
{
    public int Id { get; set; }
}

public class GetCityByIdQueryHandler : IRequestHandler<GetCityByIdQuery, DefCity>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetCityByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<DefCity> Handle(GetCityByIdQuery request, CancellationToken cancellationToken)
    {
        var City = _applicationDbContext.DefCities.FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (City != null)
            return Task.FromResult(City);
        else
            return Task.FromResult(new DefCity());

    }


}

