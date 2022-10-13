using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Optic.DefCountry.Queries.GetById;
public class GetDefCountryByIdQuery: IRequest<DB.DefCountry>
{
    public int Id { get; set; }
}

public class GetDefCountryByIdQueryHandler : IRequestHandler<GetDefCountryByIdQuery, DB.DefCountry>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetDefCountryByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public async Task<DB.DefCountry> Handle(GetDefCountryByIdQuery request, CancellationToken cancellationToken)
    {
        if(request.Id>0)
            try
            {
                var country=_applicationDbContext.DefCountries.FirstOrDefault(c => c.Id == request.Id && !c.IsDeleted);
                if(country!=null)
                    return await Task.FromResult(country);
            }
            catch (Exception)
            {
                return await Task.FromResult(new DB.DefCountry());
            }
        return await Task.FromResult(new DB.DefCountry());
    }
}