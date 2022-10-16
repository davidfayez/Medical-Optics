using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Currency.Queries.GetById;
public class GetCurrencyByIdQuery : IRequest<DefCurrency>
{
    public int Id { get; set; }
}

public class GetCurrencyByIdQueryHandler : IRequestHandler<GetCurrencyByIdQuery, DefCurrency>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetCurrencyByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<DefCurrency> Handle(GetCurrencyByIdQuery request, CancellationToken cancellationToken)
    {
        var Currency = _applicationDbContext.DefCurrencies.FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (Currency != null)
            return Task.FromResult(Currency);

        else
            return Task.FromResult(new DefCurrency());

    }


}

