using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Def.Company.Commands.Update;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Company.Commands.Create;
public class CreateCompanyCommand : AuditableEntity, IRequest<bool>, IMapFrom<DefCompany>
{
    public int Id { get; set; }
    public string CompanyNameAr { get; set; }
    public string CompanyNameEn { get; set; }
    public string CompanyAddress { get; set; }
    public string Phone1 { get; set; }
    public string Phone2 { get; set; }
    public string Phone3 { get; set; }
    public string Email { get; set; }
    public string Fax { get; set; }
    public string PostCode { get; set; }
    public string Website { get; set; }
    public string LogoUrl { get; set; }
    public DateTime FinancialYearStart { get; set; }
    public DateTime FinancialYearEnd { get; set; }
    public string Notes { get; set; }
    public string CommercialRegister { get; set; }
    public string Location { get; set; }
    public string TaxCard { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CreateCompanyCommand, DefCompany>()
               .ReverseMap();
    }
}

public class CreateCompanyCommandHandler : IRequestHandler<CreateCompanyCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateCompanyCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var complaint = _mapper.Map<DefCompany>(request);
            _applicationDbContext.DefCompanies.Add(complaint);
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

