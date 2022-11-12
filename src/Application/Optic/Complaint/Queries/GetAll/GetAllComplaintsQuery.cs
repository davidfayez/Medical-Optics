using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
public class GetAllComplaintsQuery : IRequest<List<ComplaintVM>>
{
    public List<int>? OptionalIds { get; set; }
    //public List<int>? SelectedIds { get; set; }
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
        var Complaints = _applicationDbContext.Complaints.Where(s => !s.IsDeleted);
        
        //if (request.SelectedIds != null)
        //    Complaints = Complaints.Where(s => request.SelectedIds.Contains(s.Id));

        if (request.OptionalIds != null)
            Complaints = Complaints.Where(s => !request.OptionalIds.Contains(s.Id));

        var ComplaintVMs = _mapper.Map<List<ComplaintVM>>(Complaints.ToList());
        return Task.FromResult(ComplaintVMs);   
    }
}
