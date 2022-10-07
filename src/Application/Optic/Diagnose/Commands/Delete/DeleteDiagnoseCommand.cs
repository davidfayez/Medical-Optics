using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Diagnose.Commands.Delete;
public class DeleteDiagnoseCommand:IRequest<bool>, IMapFrom<DB.Diagnose>
{
    public int Id { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<DeleteDiagnoseCommand, DB.Diagnose>()
               .ReverseMap();
    }
    public class DeleteDiagnoseCommandHandler : IRequestHandler<DeleteDiagnoseCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public DeleteDiagnoseCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(DeleteDiagnoseCommand request, CancellationToken cancellationToken)
        {
            if (request.Id > 0)
                try
                {
                    var diagnose = _applicationDbContext.Diagnoses.Find(request.Id);
                    if (diagnose != null)
                    {
                        diagnose.IsDeleted = true;
                        _applicationDbContext.Diagnoses.Update(diagnose);
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
