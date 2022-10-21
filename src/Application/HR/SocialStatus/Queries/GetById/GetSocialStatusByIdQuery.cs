using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Domain.Entities.Def;
using Medical_Optics.Domain.Entities.HR;

namespace Medical_Optics.Application.HR.SocialStatus.Queries.GetById;
public class GetSocialStatusByIdQuery : IRequest<HrSocialStatus>
{
    public int Id { get; set; }

}

public class GetSocialStatusByIdQueryHandler : IRequestHandler<GetSocialStatusByIdQuery, HrSocialStatus>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetSocialStatusByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<HrSocialStatus> Handle(GetSocialStatusByIdQuery request, CancellationToken cancellationToken)
    {
        var SocialStatus = _applicationDbContext.HrSocialStatus.FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (SocialStatus != null)
            return Task.FromResult(SocialStatus);
        else
            return Task.FromResult(new HrSocialStatus());

    }


}
