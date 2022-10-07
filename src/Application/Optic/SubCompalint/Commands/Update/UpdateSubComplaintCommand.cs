using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.SubCompalint.Commands.Update;
public class UpdateSubComplaintCommand : AuditableEntity, IRequest<bool>, IMapFrom<DB.SubComplaint>
{
    public int Id { get; set; }
    public int ComplaintId { get; set; }    // الشكوى الرئيسية
    public string SubComplaintCode { get; set; }
    public string SubComplaintNameAr { get; set; }
    public string SubComplaintNameEn { get; set; }
    public string SubComplaintPhotoPath { get; set; } // صورة الشكوى 
    public string Description { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateSubComplaintCommand, DB.SubComplaint>()
               .ReverseMap();
    }

    public class UpdateSubComplaintCommandHandler : IRequestHandler<UpdateSubComplaintCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public UpdateSubComplaintCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(UpdateSubComplaintCommand request, CancellationToken cancellationToken)
        {

            if (request.Id > 0)
                try
                {
                    var subComplaint = _mapper.Map<DB.SubComplaint>(request);
                    _applicationDbContext.SubComplaints.Update(subComplaint);
                    await _applicationDbContext.SaveChangesAsync(cancellationToken);
                    return await Task.FromResult(true);
                }
                catch (Exception ex)
                {

                    return await Task.FromResult(false);
                }
            return await Task.FromResult(false);
        }
    }
}
