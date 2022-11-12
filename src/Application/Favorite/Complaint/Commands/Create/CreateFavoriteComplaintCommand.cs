using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Application.Favorite.Complaint.Commands.Create;
public class CreateFavoriteComplaintCommand : AuditableEntity, IRequest<bool>, IMapFrom<FavoriteComplaint>
{
    public int? Id { get; set; }
    public string? FavoriteName { get; set; }
    public string? Description { get; set; }
    public List<int>? SelectedIds { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<FavoriteComplaint,CreateFavoriteComplaintCommand>()
                .ForMember(des => des.SelectedIds, opt => opt.MapFrom(src => src.FavoriteComplaintItems.Where(s => !s.IsDeleted).Select(s => s.ComplaintId).ToList()))
               .ReverseMap();
    }
}

public class CreateFavoriteComplaintCommandHandler : IRequestHandler<CreateFavoriteComplaintCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateFavoriteComplaintCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreateFavoriteComplaintCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var favoriteComplaint = _mapper.Map<FavoriteComplaint>(request);
            var FavoriteComplaintItems = new List<FavoriteComplaintItem>();

            if (request.Id != null)
            {
                var ComplaintItemsInDb = _applicationDbContext.FavoriteComplaintItems
                                                             .Where(s => !s.IsDeleted && s.FavoriteComplaintId == request.Id);
                                                             //.Select(s=>s.ComplaintId);
                
                var ComplaintsIdsinDB = ComplaintItemsInDb.Select(s => s.ComplaintId).ToList();
                var RemovedIds = ComplaintsIdsinDB.Except(request.SelectedIds);
                var InsertedIds = request.SelectedIds.Except(ComplaintsIdsinDB);
                request.SelectedIds = InsertedIds.ToList();
                _applicationDbContext.FavoriteComplaintItems.RemoveRange(ComplaintItemsInDb.Where(s => RemovedIds.Contains(s.ComplaintId)));

                request.SelectedIds.ForEach(id => FavoriteComplaintItems.Add(new FavoriteComplaintItem
                {
                    ComplaintId = id
                }));

                favoriteComplaint.FavoriteComplaintItems = FavoriteComplaintItems;
                _applicationDbContext.FavoriteComplaints.Update(favoriteComplaint);
            }
            else
            {
                request.SelectedIds.ForEach(id => FavoriteComplaintItems.Add(new FavoriteComplaintItem
                {
                    ComplaintId = id
                }));

                favoriteComplaint.FavoriteComplaintItems = FavoriteComplaintItems;
                _applicationDbContext.FavoriteComplaints.Add(favoriteComplaint);
            }
            
            await _applicationDbContext.SaveChangesAsync(cancellationToken);
            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            return await Task.FromResult(false);
            //throw;
        }

    }
}
