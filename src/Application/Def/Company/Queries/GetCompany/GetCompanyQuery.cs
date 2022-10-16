using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Def.Company.Queries.GetCompany;
public class GetCompanyQuery : IRequest<DefCompany>
{
}

public class GetCompanyQueryHandler : IRequestHandler<GetCompanyQuery, DefCompany>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetCompanyQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<DefCompany> Handle(GetCompanyQuery request, CancellationToken cancellationToken)
    {
        var Company = _applicationDbContext.DefCompanies.FirstOrDefault(s => !s.IsDeleted);

        if (Company != null)
            return Task.FromResult(Company);
        else
            return Task.FromResult(new DefCompany());

    }


}