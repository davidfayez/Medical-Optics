using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.City.Queries.GetAll;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;

namespace Medical_Optics.Application.Def.Company.Queries.GetAll;
public class GetAllCompaniesQuery : IRequest<List<CompanyVM>>
{

}

public class GetAllCompaniesQueryHandler : IRequestHandler<GetAllCompaniesQuery, List<CompanyVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllCompaniesQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<CompanyVM>> Handle(GetAllCompaniesQuery request, CancellationToken cancellationToken)
    {
        var Companies = _applicationDbContext.DefCompanies.Where(s => !s.IsDeleted).ToList();
        var CompaniesVMs = _mapper.Map<List<CompanyVM>>(Companies);
        return Task.FromResult(CompaniesVMs);
    }
}

