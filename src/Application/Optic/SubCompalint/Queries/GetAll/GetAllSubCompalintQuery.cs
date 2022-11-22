using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Domain.Entities.Optic;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.SubCompalint.Queries.GetAll;
public class GetAllSubCompalintQuery: IRequest<List<SubCompalintVM>>
{
    public int? CompalintId { get; set; }
}

public class GetAllSubCompalintQueryHandler : IRequestHandler<GetAllSubCompalintQuery, List<SubCompalintVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllSubCompalintQueryHandler(IApplicationDbContext applicationDbContext,IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<SubCompalintVM>> Handle(GetAllSubCompalintQuery request, CancellationToken cancellationToken)
    {
        var SubComplaints = _applicationDbContext.SubComplaints.Where(s => !s.IsDeleted);

        if (request.CompalintId != null)
            SubComplaints = SubComplaints.Where(s => s.ComplaintId == request.CompalintId);

        var SubComplaintVms = _mapper.Map<List<SubCompalintVM>>(SubComplaints.ToList());
        return Task.FromResult(SubComplaintVms);

    }
}
