using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Entities.Def;
using Medical_Optics.Domain.Entities.HR;

namespace Medical_Optics.Application.HR.SocialStatus.Commands.Delete;
public class DeleteSocialStatusCommand : IRequest<bool>, IMapFrom<HrSocialStatus>
{
    public int Id { get; set; }
}

public class DeleteSocialStatusCommandHandler : IRequestHandler<DeleteSocialStatusCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteSocialStatusCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteSocialStatusCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var SocialStatus = _applicationDbContext.HrSocialStatus.Find(request.Id);
            if (SocialStatus != null)
            {
                SocialStatus.IsDeleted = true;
                _applicationDbContext.HrSocialStatus.Update(SocialStatus);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}
