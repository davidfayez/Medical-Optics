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
using Medical_Optics.Domain.Common;

namespace Medical_Optics.Application.Def.Currency.Commands.Update;
public class UpdateCurrencyCommand : AuditableEntity, IRequest<bool>, IMapFrom<DefCurrency>
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string CurrencyNameAr { get; set; }
    public string CurrencyNameEn { get; set; }
    public string AbbreviationAr { get; set; }
    public string AbbreviationEn { get; set; }
    public bool IsPimary { get; set; }
    public decimal DefaultFactor { get; set; }
    public string? Notes { get; set; }
    public int? DefBranchId { get; set; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateCurrencyCommand, DefCurrency>()
               .ReverseMap();
    }
}

public class UpdateCurrencyCommandHandler : IRequestHandler<UpdateCurrencyCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public UpdateCurrencyCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(UpdateCurrencyCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            try
            {
                var Currency = _mapper.Map<DefCurrency>(request);
                _applicationDbContext.DefCurrencies.Update(Currency);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(false);
            }

        }
        return await Task.FromResult(false);
    }
}

