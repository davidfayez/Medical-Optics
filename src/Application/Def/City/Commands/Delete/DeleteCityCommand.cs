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
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.City.Commands.Delete;
public class DeleteCityCommand : IRequest<bool>, IMapFrom<DefCity>
{
    public int Id { get; set; }

}

public class DeleteCityCommandHandler : IRequestHandler<DeleteCityCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteCityCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteCityCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var City = _applicationDbContext.DefCities.Find(request.Id);
            if (City != null)
            {
                City.IsDeleted = true;
                _applicationDbContext.DefCities.Update(City);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}

