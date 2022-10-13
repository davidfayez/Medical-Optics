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
using Medical_Optics.Application.Def.Branch.Commands.Create;
using Medical_Optics.Domain.Common;

namespace Medical_Optics.Application.Def.Branch.Commands.Create;
public class CreateBranchCommand : AuditableEntity, IRequest<bool>, IMapFrom<DefBranch>
{
    public int Id { get; set; }
    public string BranchCode { get; set; }
    public string BranchNameAr { get; set; }
    public string BranchNameEn { get; set; }
    public int DefCompanyId { get; set; }
    public string BranchAddress { get; set; }
    public string Phone1 { get; set; }
    public string Phone2 { get; set; }
    public string Phone3 { get; set; }
    public string Email { get; set; }
    public string Fax { get; set; }
    public string Fax2 { get; set; }
    public string Fax3 { get; set; }
    public string PostCode { get; set; }
    public string Notes { get; set; }
    public string LogoUrl { get; set; }
    public int? DefCountryId { get; set; }
    public int? DefBranchId { get; set; }
    public string CommercialRegister { get; set; }
    public string TaxCard { get; set; }
    public string Website { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CreateBranchCommand, DefBranch>()
               .ReverseMap();
    }

}

public class CreateBranchCommandHandler : IRequestHandler<CreateBranchCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateBranchCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreateBranchCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var branch = _mapper.Map<DefBranch>(request);
            _applicationDbContext.DefBranches.Add(branch);
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

