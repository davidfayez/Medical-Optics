using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Branches.Dtos;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Branches.Queries.GetAll;
 public class GetAllBranchesQuery : IRequest<List<BranchDto>>
{

}

public class GetAllBranchesQueryHandler : IRequestHandler<GetAllBranchesQuery, List<BranchDto>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllBranchesQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<BranchDto>> Handle(GetAllBranchesQuery request, CancellationToken cancellationToken)
    {
        var branches = _applicationDbContext.DefBranches.ToList();
        return Task.FromResult(_mapper.Map<List<BranchDto>>(branches));

    }
}
