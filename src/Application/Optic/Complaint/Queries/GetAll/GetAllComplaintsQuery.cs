using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
public class GetAllComplaintsQuery : IRequest<List<ComplaintVM>>
{

}

public class GetAllComplaintsQueryHandler : IRequestHandler<GetAllComplaintsQuery, List<ComplaintVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllComplaintsQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<ComplaintVM>> Handle(GetAllComplaintsQuery request, CancellationToken cancellationToken)
    {
        var Complaints = _applicationDbContext.Complaints.Where(s=>!s.IsDeleted).ToList();
        var ComplaintVMs = _mapper.Map<List<ComplaintVM>>(Complaints);
        return Task.FromResult(ComplaintVMs);   
    }
}
