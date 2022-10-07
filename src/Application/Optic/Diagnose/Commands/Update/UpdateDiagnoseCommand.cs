using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Diagnose.Commands.Update;
public  class UpdateDiagnoseCommand : AuditableEntity, IRequest<bool>, IMapFrom<DB.Diagnose>
{
    public int Id { get; set; }
    public string DiagnoseCode { get; set; }
    public string DiagnoseNameAr { get; set; }
    public string DiagnoseNameEn { get; set; }
    public string Description { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateDiagnoseCommand, DB.Diagnose>()
               .ReverseMap();
    }

    public class UpdateDiagnoseCommandHandler : AuditableEntity, IRequestHandler<UpdateDiagnoseCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;
            
        public UpdateDiagnoseCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(UpdateDiagnoseCommand request, CancellationToken cancellationToken)
        {
            if (request.Id > 0)
                try
                {
                    var diagnose = _mapper.Map<DB.Diagnose>(request);
                    _applicationDbContext.Diagnoses.Update(diagnose);
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
