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

namespace Medical_Optics.Application.Def.Branch.Commands.Delete;
public class DeleteBranchCommand : IRequest<bool>, IMapFrom<DefBranch>
{
    public int Id { get; set; }

}

public class DeleteBranchCommandHandler : IRequestHandler<DeleteBranchCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteBranchCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteBranchCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var Branch = _applicationDbContext.DefBranches.Find(request.Id);
            if (Branch != null)
            {
                Branch.IsDeleted = true;
                _applicationDbContext.DefBranches.Update(Branch);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}
