using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Def.City.Commands.Update;
using Medical_Optics.Domain.Common;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.City.Commands.Update;
public class UpdateCityCommand : AuditableEntity, IRequest<bool>, IMapFrom<DefCity>
{
    public int Id { get; set; }
    public string CityCode { get; set; }
    public string CityNameAr { get; set; }
    public string CityNameEn { get; set; }
    public string GovernorateNameAr { get; set; }
    public string GovernorateNameEn { get; set; }
    public int DefCountryId { get; set; }
    public string Description { get; set; }
    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateCityCommand, DefCity>()
               .ReverseMap();
    }
}

public class UpdateCityCommandHandler : IRequestHandler<UpdateCityCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public UpdateCityCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(UpdateCityCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            try
            {
                var City = _mapper.Map<DefCity>(request);
                _applicationDbContext.DefCities.Update(City);
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

