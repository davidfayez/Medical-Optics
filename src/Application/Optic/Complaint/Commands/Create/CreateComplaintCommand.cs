using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using Microsoft.AspNetCore.Http;
using DB = Medical_Optics.Domain.Entities.Optic;


namespace Medical_Optics.Application.Optic.Complaint.Commands.Create;
public class CreateComplaintCommand : AuditableEntity, IRequest<bool>, IMapFrom<DB.Complaint>
{
    public int Id { get; set; }
    public string ComplaintCode { get; set; }
    public string ComplaintNameAr { get; set; }
    public string ComplaintNameEn { get; set; }
    public string ComplaintImagePath { get; set; }
    public string Description { get; set; }
    public IFormFile ComplaintImage { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CreateComplaintCommand, DB.Complaint>()
               .ReverseMap();
    }
}

public class CreateComplaintCommandHandler : IRequestHandler<CreateComplaintCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateComplaintCommandHandler(IApplicationDbContext applicationDbContext,IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreateComplaintCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var complaint = _mapper.Map<DB.Complaint>(request);
            _applicationDbContext.Complaints.Add(complaint);
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
