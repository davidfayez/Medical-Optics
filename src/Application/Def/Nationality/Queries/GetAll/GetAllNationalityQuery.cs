using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Def.Nationality.Queries.GetAll;
public class GetAllNationalityQuery:IRequest<List<NationalityVM>>
{

}

public class GetAllNationalityQueryHandler : IRequestHandler<GetAllNationalityQuery, List<NationalityVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllNationalityQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<List<NationalityVM>> Handle(GetAllNationalityQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var nationality = _applicationDbContext.DefNationalities.Where(d => !d.IsDeleted).ToList();
            var nationalityVMs = _mapper.Map<List<NationalityVM>>(nationality);
            return await Task.FromResult(nationalityVMs);
        }
        catch (Exception)
        {

            return await Task.FromResult(new List<NationalityVM>());
        }
    }
}
