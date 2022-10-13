using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Optic.DefReligion.Commands.Create;
public class CreateDefReligionCommand: AuditableEntity,IRequest<bool>,IMapFrom<DB.DefReligion>
{
    public int Id { get; set; }
    public string ReligionCode { get; set; }
    public string ReligionNameAr { get; set; }
    public string ReligionNameEn { get; set; }
    public string Description { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CreateDefReligionCommand, DB.DefReligion>()
            .ReverseMap();
    }

    public class CreateDefReligionCommandHandler : IRequestHandler<CreateDefReligionCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public CreateDefReligionCommandHandler(IApplicationDbContext applicationDbContext,IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(CreateDefReligionCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var religion = _mapper.Map<DB.DefReligion>(request);
                _applicationDbContext.DefReligions.Add(religion);
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

