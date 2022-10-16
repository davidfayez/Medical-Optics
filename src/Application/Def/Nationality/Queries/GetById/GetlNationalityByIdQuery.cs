using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Nationality.Queries.GetById;
public class GetlNationalityByIdQuery:IRequest<DefNationality>
{
    public int Id { get; set; }
}

public class GetlNationalityByIdQueryHandler : IRequestHandler<GetlNationalityByIdQuery, DefNationality>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetlNationalityByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public async Task<DefNationality> Handle(GetlNationalityByIdQuery request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
            try
            {
                var nationality = _applicationDbContext.DefNationalities.FirstOrDefault(x => x.Id == request.Id && !x.IsDeleted);
                if (nationality != null)
                {
                    return await Task.FromResult(nationality);
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new DefNationality());
            }
        return await Task.FromResult(new DefNationality());
    }
}
