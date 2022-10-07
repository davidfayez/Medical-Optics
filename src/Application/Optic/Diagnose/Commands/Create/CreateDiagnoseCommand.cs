using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Diagnose.Commands.Create;
public class CreateDiagnoseCommand: AuditableEntity,IRequest<bool>, IMapFrom<DB.Diagnose>
{
    public int Id { get; set; }
    public string DiagnoseCode { get; set; }
    public string DiagnoseNameAr { get; set; }
    public string DiagnoseNameEn { get; set; }
    public string Description { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CreateDiagnoseCommand, DB.Diagnose>()
               .ReverseMap();
    }

    public class CreateDiagnoseCommandHandler : IRequestHandler<CreateDiagnoseCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public CreateDiagnoseCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(CreateDiagnoseCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var diagnose = _mapper.Map<DB.Diagnose>(request);
                _applicationDbContext.Diagnoses.Add(diagnose);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
            catch (Exception)
            {

                return await Task.FromResult(false);
            }
        }
    }
}
