using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.SubCompalint.Queries.GetById;
public class GetSubComplaintByIdQuery : IRequest<DB.SubComplaint>
{
    public int Id { get; set; }
}

public class GetSubComplaintByIdQueryHandler : IRequestHandler<GetSubComplaintByIdQuery, DB.SubComplaint>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetSubComplaintByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public async Task<DB.SubComplaint> Handle(GetSubComplaintByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var subComplaint = _applicationDbContext.SubComplaints.FirstOrDefault(c => c.Id == request.Id && !c.IsDeleted);
            if (subComplaint != null)
                return await Task.FromResult(subComplaint);
        }
        catch (Exception ex)
        {

            return await Task.FromResult(new DB.SubComplaint());
        }
        return await Task.FromResult(new DB.SubComplaint());


    }
}
