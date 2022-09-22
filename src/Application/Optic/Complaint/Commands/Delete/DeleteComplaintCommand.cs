using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Complaint.Commands.Delete;
public class DeleteComplaintCommand : IRequest<bool>, IMapFrom<DB.Complaint>
{
    public int Id { get; set; }
    
}

public class DeleteComplaintCommandHandler : IRequestHandler<DeleteComplaintCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteComplaintCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteComplaintCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var Complaint = _applicationDbContext.Complaints.Find(request.Id);
            if (Complaint != null)
            {
                Complaint.IsDeleted = true;
                _applicationDbContext.Complaints.Update(Complaint);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}
