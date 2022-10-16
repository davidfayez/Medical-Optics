using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MediatR;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using ERP.DAL.Domains.Def;
using AutoMapper;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Currency.Commands.Create;
public class CreateCurrencyCommand : AuditableEntity, IRequest<bool>, IMapFrom<DefCurrency>
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
        profile.CreateMap<CreateCurrencyCommand, DefCurrency>()
               .ReverseMap();
    }
}

public class CreateCurrencyCommandHandler : IRequestHandler<CreateCurrencyCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateCurrencyCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreateCurrencyCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var complaint = _mapper.Map<DefCurrency>(request);
            _applicationDbContext.DefCurrencies.Add(complaint);
            await _applicationDbContext.SaveChangesAsync(cancellationToken);
            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            return await Task.FromResult(false);
            //throw;
        }

    }
}

