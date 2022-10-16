using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;
using Microsoft.AspNetCore.Http;

namespace Medical_Optics.Application.Def.Branch.Commands.Update;
public class UpdateBranchCommand : AuditableEntity, IRequest<bool>, IMapFrom<DefBranch>
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
    public int? DefCityId { get; set; }
    public int? DefBranchId { get; set; }
    public string CommercialRegister { get; set; }
    public string TaxCard { get; set; }
    public string Website { get; set; }
    public IFormFile BranchImage { get; set; }


    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateBranchCommand, DefBranch>()
               .ReverseMap();
    }
}

public class UpdateBranchCommandHandler : IRequestHandler<UpdateBranchCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public UpdateBranchCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(UpdateBranchCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            try
            {
                var Branch = _mapper.Map<DefBranch>(request);
                _applicationDbContext.DefBranches.Update(Branch);
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

