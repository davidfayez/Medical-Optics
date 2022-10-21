using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.HR.SocialStatus.Queries.GetAll;
public class GetAllSocialStatusQuery : IRequest<List<SocialStatusVM>>
{

}

public class GetAllSocialStatusQueryHandler : IRequestHandler<GetAllSocialStatusQuery, List<SocialStatusVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllSocialStatusQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<SocialStatusVM>> Handle(GetAllSocialStatusQuery request, CancellationToken cancellationToken)
    {
        var SocialStatus = _applicationDbContext.HrSocialStatus.Where(s => !s.IsDeleted).ToList();
        var SocialStatusVMs = _mapper.Map<List<SocialStatusVM>>(SocialStatus);
        return Task.FromResult(SocialStatusVMs);
    }
}

