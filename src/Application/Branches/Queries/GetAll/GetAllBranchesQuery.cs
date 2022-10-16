using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.Branch.Queries.GetAll;

namespace Medical_Optics.Application.Branches.Queries.GetAll;
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
        var branches = _applicationDbContext.DefBranches.Where(b => !b.IsDeleted).ToList();
        return Task.FromResult(_mapper.Map<List<BranchVM>>(branches));

    }
}
