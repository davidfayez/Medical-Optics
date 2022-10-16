using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.Branch.Queries.GetById;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Branch.Queries.GetById;
public class GetBranchByIdQuery : IRequest<DefBranch>
{
    public int Id { get; set; }
}

public class GetBranchByIdQueryHandler : IRequestHandler<GetBranchByIdQuery, DefBranch>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetBranchByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<DefBranch> Handle(GetBranchByIdQuery request, CancellationToken cancellationToken)
    {
        var Branch = _applicationDbContext.DefBranches.FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (Branch != null)
            return Task.FromResult(Branch);
        else
            return Task.FromResult(new DefBranch());

    }


}
