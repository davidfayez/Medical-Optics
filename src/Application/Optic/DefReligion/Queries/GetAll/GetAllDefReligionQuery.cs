using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;

namespace Medical_Optics.Application.Optic.DefReligion.Queries.GetAll;
public class GetAllDefReligionQuery:IRequest<List<DefReligionVM>>
{

}

public class GetAllDefReligionQueryHandler : IRequestHandler<GetAllDefReligionQuery, List<DefReligionVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllDefReligionQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<DefReligionVM>> Handle(GetAllDefReligionQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var religion = _applicationDbContext.DefReligions.Where(d => !d.IsDeleted).ToList();
            var religionVMs = _mapper.Map<List<DefReligionVM>>(religion);
            return Task.FromResult(religionVMs);

        }
        catch (Exception)
        {
            return Task.FromResult(new List<DefReligionVM>());
        }

    }
}
