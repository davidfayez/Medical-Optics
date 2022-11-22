using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Favorite.Complaint.Queries.GetAll;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;

namespace Medical_Optics.Application.Favorite.Complaint.Queries.GetComplaintsByFavoriteId;
public class GetComplaintsByFavoriteIdQuery : IRequest<List<ComplaintVM>>
{
    public int FavoriteId { get; set; }
}

public class GetComplaintsByFavoriteIdQueryHandler : IRequestHandler<GetComplaintsByFavoriteIdQuery, List<ComplaintVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetComplaintsByFavoriteIdQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<ComplaintVM>> Handle(GetComplaintsByFavoriteIdQuery request, CancellationToken cancellationToken)
    {
        var FavoriteComplaints = _applicationDbContext.FavoriteComplaints
                                              .Include(s=>s.FavoriteComplaintItems)
                                              .ThenInclude(s=>s.Complaint)
                                              .FirstOrDefault(s => s.Id == request.FavoriteId);

        var Complaints = FavoriteComplaints?.FavoriteComplaintItems
                                            .Where(s => !s.IsDeleted)
                                            .Select(s => s.Complaint);

        var ComplaintVMs = _mapper.Map<List<ComplaintVM>>(Complaints.ToList());
        return Task.FromResult(ComplaintVMs);
    }
}

