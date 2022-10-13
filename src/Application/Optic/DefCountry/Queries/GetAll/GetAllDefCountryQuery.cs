using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Optic.DefCountry.Queries.GetAll;
public class GetAllDefCountryQuery:IRequest<List<DefCountryVM>>
{
}

public class GetAllDefCountryQueryHandler : IRequestHandler<GetAllDefCountryQuery, List<DefCountryVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllDefCountryQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<DefCountryVM>> Handle(GetAllDefCountryQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var country = _applicationDbContext.DefCountries.Where(d => !d.IsDeleted).ToList();
            var countryVMs = _mapper.Map<List<DefCountryVM>>(country);
            return Task.FromResult(countryVMs);
        }
        catch (Exception)
        {
            return Task.FromResult(new List<DefCountryVM>());
        }
    }
}
