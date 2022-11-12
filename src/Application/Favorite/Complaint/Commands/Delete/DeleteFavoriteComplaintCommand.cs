using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Commands.Delete;

namespace Medical_Optics.Application.Favorite.Complaint.Commands.Delete;
public class DeleteFavoriteComplaintCommand : IRequest<bool>
{
    public int Id { get; set; }
}

public class DeleteFavoriteComplaintCommandHandler : IRequestHandler<DeleteFavoriteComplaintCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteFavoriteComplaintCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteFavoriteComplaintCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var FavoriteComplaint = _applicationDbContext.FavoriteComplaints.Find(request.Id);
            if (FavoriteComplaint != null)
            {
                FavoriteComplaint.IsDeleted = true;
                _applicationDbContext.FavoriteComplaints.Update(FavoriteComplaint);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}

