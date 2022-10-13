using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.Branch.Queries.GetAll;

namespace Medical_Optics.Application.Def.Branch.Queries.GetAll;
public class GetAllBranchesQuery : IRequest<List<BranchVM>>
{

}

public class GetAllBranchesQueryHandler : IRequestHandler<GetAllBranchesQuery, List<BranchVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllBranchesQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<BranchVM>> Handle(GetAllBranchesQuery request, CancellationToken cancellationToken)
    {
        var Branches = _applicationDbContext.DefBranches.Where(s => !s.IsDeleted).ToList();
        var BranchesVMs = _mapper.Map<List<BranchVM>>(Branches);
        return Task.FromResult(BranchesVMs);
    }
}

