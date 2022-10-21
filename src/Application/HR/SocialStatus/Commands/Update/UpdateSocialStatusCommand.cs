using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;
using Medical_Optics.Domain.Entities.HR;

namespace Medical_Optics.Application.HR.SocialStatus.Commands.Update;
public class UpdateSocialStatusCommand : AuditableEntity, IRequest<bool>, IMapFrom<HrSocialStatus>
{
    public int Id { get; set; }
    public string TypeCode { get; set; }
    public string TypeNameAr { get; set; }
    public string TypeNameEn { get; set; }
    public string Description { get; set; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateSocialStatusCommand, HrSocialStatus>()
               .ReverseMap();
    }
}

public class UpdateSocialStatusCommandHandler : IRequestHandler<UpdateSocialStatusCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public UpdateSocialStatusCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(UpdateSocialStatusCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            try
            {
                var SocialStatus = _mapper.Map<HrSocialStatus>(request);
                _applicationDbContext.HrSocialStatus.Update(SocialStatus);
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



