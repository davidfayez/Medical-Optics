using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Currency.Commands.Delete;
public class DeleteCurrencyCommand : IRequest<bool>, IMapFrom<DefCurrency>
{
    public int Id { get; set; }

}

public class DeleteCurrencyCommandHandler : IRequestHandler<DeleteCurrencyCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteCurrencyCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteCurrencyCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var Currency = _applicationDbContext.DefCurrencies.Find(request.Id);
            if (Currency != null)
            {
                Currency.IsDeleted = true;
                _applicationDbContext.DefCurrencies.Update(Currency);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}

