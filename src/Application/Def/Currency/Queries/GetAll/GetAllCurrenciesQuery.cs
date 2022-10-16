using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Def.Currency.Queries.GetAll;
public class GetAllCurrenciesQuery : IRequest<List<CurrencyVM>>
{

}

public class GetAllCurrenciesQueryHandler : IRequestHandler<GetAllCurrenciesQuery, List<CurrencyVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllCurrenciesQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<CurrencyVM>> Handle(GetAllCurrenciesQuery request, CancellationToken cancellationToken)
    {
        var Currencies = _applicationDbContext.DefCurrencies.Where(s => !s.IsDeleted).ToList();
        var CurrencyVMs = _mapper.Map<List<CurrencyVM>>(Currencies);
        return Task.FromResult(CurrencyVMs);
    }
}

