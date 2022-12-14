using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Common;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Optic.DefCountry.Commands.Create;
public class CreateDefCountryCommand: AuditableEntity, IRequest<bool>, IMapFrom<DB.DefCountry>
{
    public int Id { get; set; }
    public string CountryCode { get; set; }
    public string CountryNameAr { get; set; }
    public string CountryNameEn { get; set; }
    public string CapitalNameAr { get; set; }
    public string CapitalNameEn { get; set; }
    public string Description { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<CreateDefCountryCommand, DB.DefCountry>()
               .ReverseMap();
    }

    public class CreateDefCountryCommandHandler : IRequestHandler<CreateDefCountryCommand, bool>
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IMapper _mapper;

        public CreateDefCountryCommandHandler(IApplicationDbContext applicationDbContext,IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }
        public async Task<bool> Handle(CreateDefCountryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var Country = _mapper.Map<DB.DefCountry>(request);
                _applicationDbContext.DefCountries.Add(Country);
               await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(false);
            }
        }
    }
}
