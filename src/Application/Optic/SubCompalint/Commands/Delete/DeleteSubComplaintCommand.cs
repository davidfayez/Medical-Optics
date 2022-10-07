using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.SubCompalint.Commands.Delete;
public class DeleteSubComplaintCommand : IRequest<bool>, IMapFrom<DB.SubComplaint>
{
    public int Id { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<DeleteSubComplaintCommand, DB.SubComplaint>()
               .ReverseMap();
    }

    public class DeleteSubComplaintCommandHandler : IRequestHandler<DeleteSubComplaintCommand, bool>
    {
        private readonly IApplicationDbContext _applicatioDbContext;
        private readonly IMapper _mapper;

        public DeleteSubComplaintCommandHandler(IApplicationDbContext applicatioDbContext, IMapper mapper)
        {
            _applicatioDbContext = applicatioDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(DeleteSubComplaintCommand request, CancellationToken cancellationToken)
        {
            if (request.Id > 0)
                try
                {
                    var subComplaint = _applicatioDbContext.SubComplaints.Find(request.Id);
                    if (subComplaint != null)
                    {
                        _applicatioDbContext.SubComplaints.Update(subComplaint);
                        await _applicatioDbContext.SaveChangesAsync(cancellationToken);
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
