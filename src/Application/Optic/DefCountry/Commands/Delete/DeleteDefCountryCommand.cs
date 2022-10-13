using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Optic.DefCountry.Commands.Delete;
public class DeleteDefCountryCommand:IRequest<bool>,IMapFrom<DB.DefCountry>
{
    public int Id { get; set; }
}

public class DeleteDefCountryCommandHandler : IRequestHandler<DeleteDefCountryCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteDefCountryCommandHandler(IApplicationDbContext applicationDbContext,IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<bool> Handle(DeleteDefCountryCommand request, CancellationToken cancellationToken)
    {
        if(request.Id >0)
            try
            {
                var country = _applicationDbContext.DefCountries.Find(request.Id);
                if(country != null)
                {
                    country.IsDeleted = true;
                    _applicationDbContext.DefCountries.Update(country);
                    _applicationDbContext.SaveChangesAsync(cancellationToken);
                    return Task.FromResult(true);   
                }
            }
            catch (Exception)
            {
                return Task.FromResult(false);

            }
        return Task.FromResult(false);

    }
}

