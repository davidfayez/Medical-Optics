using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Complaint.Queries.GetById;
public class GetComplaintByIdQuery : IRequest<DB.Complaint>
{
    public int Id { get; set; }
}

public class GetComplaintByIdQueryHandler : IRequestHandler<GetComplaintByIdQuery, DB.Complaint>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetComplaintByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<DB.Complaint> Handle(GetComplaintByIdQuery request, CancellationToken cancellationToken)
    {
        var Complaint = _applicationDbContext.Complaints.FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (Complaint != null)
        {
            Complaint.ComplaintImagePath =Complaint.ComplaintImagePath != null ? "Complaints/" + Complaint.ComplaintImagePath : "Users/profile-icon.jpg";
            return Task.FromResult(Complaint);
        }
        else
            return Task.FromResult(new DB.Complaint());

    }

    
}
