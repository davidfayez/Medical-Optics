using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Favorite.Complaint.Queries.GetAll;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Application.Favorite.Complaint.Queries.GetById;
public class GetFavotiteComplaintByIdQuery : IRequest<FavoriteComplaint>
{
    public int Id { get; set; }
}

public class GetFavotiteComplaintByIdQueryHandler : IRequestHandler<GetFavotiteComplaintByIdQuery, FavoriteComplaint>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetFavotiteComplaintByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<FavoriteComplaint> Handle(GetFavotiteComplaintByIdQuery request, CancellationToken cancellationToken)
    {
        var FavoriteComplaint = _applicationDbContext.FavoriteComplaints.Include(s=>s.FavoriteComplaintItems)
                                                                        .FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (FavoriteComplaint != null)
            return Task.FromResult(FavoriteComplaint);
        else
            return Task.FromResult(new FavoriteComplaint());

    }


}