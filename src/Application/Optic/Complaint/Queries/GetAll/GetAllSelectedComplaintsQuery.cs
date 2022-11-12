using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
public class GetAllSelectedComplaintsQuery : IRequest<List<ComplaintVM>>
{
    public List<int>? SelectedIds { get; set; }
}

public class GetAllSelectedComplaintsQueryHandler : IRequestHandler<GetAllSelectedComplaintsQuery, List<ComplaintVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllSelectedComplaintsQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<ComplaintVM>> Handle(GetAllSelectedComplaintsQuery request, CancellationToken cancellationToken)
    {
        var Complaints = _applicationDbContext.Complaints.Where(s => !s.IsDeleted);
       
        if (request.SelectedIds != null)
            Complaints = Complaints.Where(s => request.SelectedIds.Contains(s.Id));

        var ComplaintVMs = _mapper.Map<List<ComplaintVM>>(Complaints.ToList());
        return Task.FromResult(ComplaintVMs);   
    }
}

