using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.DefReligion.Commands.Create;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Optic.DefReligion.Commands.Update;

public class UpdateDefReligionCommand: AuditableEntity, IRequest<bool> ,IMapFrom<DB.DefReligion>
{
    public int Id { get; set; }
    public string ReligionCode { get; set; }
    public string ReligionNameAr { get; set; }
    public string ReligionNameEn { get; set; }
    public string Description { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateDefReligionCommand, DB.DefReligion>()
            .ReverseMap();
    }

    public class UpdateDefReligionCommandHandler : IRequestHandler<UpdateDefReligionCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public UpdateDefReligionCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(UpdateDefReligionCommand request, CancellationToken cancellationToken)
        {
            if (request.Id > 0)
                try
                {
                    var religion = _mapper.Map<DB.DefReligion>(request);
                    _applicationDbContext.DefReligions.Update(religion);
                    await _applicationDbContext.SaveChangesAsync(cancellationToken);
                    return await Task.FromResult(true);
                }
                catch (Exception)
                {
                    return await Task.FromResult(false);
                }
            return await Task.FromResult(false);
        }
    }
}
