using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Optic;


namespace Medical_Optics.Application.Optic.SubCompalint.Commands.Create;
public class CreateSubComplaintCommand: AuditableEntity, IRequest<bool>, IMapFrom<DB.SubComplaint>
{
    public int Id { get; set; }
    public int ComplaintId { get; set; }             // الشكوى الرئيسية
    public string SubComplaintCode { get; set; }
    public string SubComplaintNameAr { get; set; }
    public string SubComplaintNameEn { get; set; }
    public string SubComplaintPhotoPath { get; set; } // صورة الشكوى 
    public string Description { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CreateSubComplaintCommand, DB.SubComplaint>()
               .ReverseMap();
    }

    public class CreateSubComplaintCommandHandler : IRequestHandler<CreateSubComplaintCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public CreateSubComplaintCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(CreateSubComplaintCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var subComplaint = _mapper.Map<DB.SubComplaint>(request);
                if (subComplaint != null)
                {
                    _applicationDbContext.SubComplaints.Add(subComplaint);
                    await _applicationDbContext.SaveChangesAsync(cancellationToken);
                    return await Task.FromResult(true);
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(false);
            }
            return await Task.FromResult(false);
        }
    }
}
