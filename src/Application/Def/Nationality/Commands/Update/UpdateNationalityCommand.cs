using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Def.Nationality.Commands.Create;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Nationality.Commands.Update;
public class UpdateNationalityCommand : AuditableEntity, IRequest<bool>, IMapFrom<DefNationality>
{
    public int Id { get; set; }
    public string NationalityCode { get; set; }
    public string NationalityNameAr { get; set; }
    public string NationalityNameEn { get; set; }
    public string Description { get; set; }
    public int? DefBranchId { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateNationalityCommand, DefNationality>()
               .ReverseMap();
    }

    public class UpdateNationalityCommandHandler : IRequestHandler<UpdateNationalityCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;
        public UpdateNationalityCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(UpdateNationalityCommand request, CancellationToken cancellationToken)
        {
            if (request.Id > 0)
            {
                try
                {
                    var nationality = _mapper.Map<DefNationality>(request);
                    _applicationDbContext.DefNationalities.Update(nationality);
                    await _applicationDbContext.SaveChangesAsync(cancellationToken);
                    return await Task.FromResult(true);
                }
                catch (Exception ex)
                {
                    return await Task.FromResult(false);
                }
            }
            return await Task.FromResult(false);
        }
    }

}
