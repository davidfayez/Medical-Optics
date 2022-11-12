using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;

namespace Medical_Optics.Application.Favorite.Complaint.Queries.GetAll;
public class GetAllFavoritesComplaintsQuery : IRequest<List<FavoriteComplaintVM>>
{
    //public List<int>? OptionalIds { get; set; }
    //public List<int>? SelectedIds { get; set; }
}

public class GetAllFavoritesComplaintsQueryHandler : IRequestHandler<GetAllFavoritesComplaintsQuery, List<FavoriteComplaintVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllFavoritesComplaintsQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<FavoriteComplaintVM>> Handle(GetAllFavoritesComplaintsQuery request, CancellationToken cancellationToken)
    {
        var FavoriteComplaints = _applicationDbContext.FavoriteComplaints
                                                      .Include(s => s.FavoriteComplaintItems)
                                                      .Where(s => !s.IsDeleted);
        //if(request.SelectedIds != null)
        //    FavoriteComplaints = FavoriteComplaints.Where(s => request.SelectedIds.Contains(s.Id));

        //if(request.OptionalIds != null)
        //    FavoriteComplaints = FavoriteComplaints.Where(s => !request.OptionalIds.Contains(s.Id));

        var FavoriteComplaintsVMs = _mapper.Map<List<FavoriteComplaintVM>>(FavoriteComplaints.ToList());
        return Task.FromResult(FavoriteComplaintsVMs);
    }
}
