using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using DB = Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Optic.DefReligion.Queries.GetById;
public class GetDefReligionByIdQuery: IRequest<DB.DefReligion>
{
    public int Id { get; set; }
}

public class GetDefReligionByIdQueryHandler : IRequestHandler<GetDefReligionByIdQuery, DB.DefReligion>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetDefReligionByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public async Task<DB.DefReligion> Handle(GetDefReligionByIdQuery request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
            try
            {
                var religion = _applicationDbContext.DefReligions.FirstOrDefault(c => c.Id == request.Id && !c.IsDeleted);
                if (religion != null)
                    return await Task.FromResult(religion);
            }
            catch (Exception)
            {
                return await Task.FromResult(new DB.DefReligion());
            }
        return await Task.FromResult(new DB.DefReligion());
    }
}
