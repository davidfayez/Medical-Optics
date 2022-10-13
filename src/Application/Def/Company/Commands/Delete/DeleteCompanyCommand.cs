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

namespace Medical_Optics.Application.Def.Company.Commands.Delete;
public class DeleteCompanyCommand : IRequest<bool>, IMapFrom<DefCompany>
{
    public int Id { get; set; }

}

public class DeleteCompanyCommandHandler : IRequestHandler<DeleteCompanyCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteCompanyCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteCompanyCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var Company = _applicationDbContext.DefCompanies.Find(request.Id);
            if (Company != null)
            {
                Company.IsDeleted = true;
                _applicationDbContext.DefCompanies.Update(Company);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}
