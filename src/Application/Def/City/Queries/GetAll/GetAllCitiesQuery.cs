using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;

namespace Medical_Optics.Application.Def.City.Queries.GetAll;
public class GetAllCitiesQuery : IRequest<List<CityVM>>
{

}

public class GetAllCitiesQueryHandler : IRequestHandler<GetAllCitiesQuery, List<CityVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllCitiesQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<CityVM>> Handle(GetAllCitiesQuery request, CancellationToken cancellationToken)
    {
        var Cities = _applicationDbContext.DefCities.Where(s => !s.IsDeleted).ToList();
        var CitiesVMs = _mapper.Map<List<CityVM>>(Cities);
        return Task.FromResult(CitiesVMs);
    }
}

