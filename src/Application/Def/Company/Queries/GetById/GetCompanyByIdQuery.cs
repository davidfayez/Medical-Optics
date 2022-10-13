using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.DAL.Domains.Def;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;

namespace Medical_Optics.Application.Def.Company.Queries.GetById;
public class GetCompanyByIdQuery : IRequest<DefCompany>
{
    public int Id { get; set; }
}

public class GetCompanyByIdQueryHandler : IRequestHandler<GetCompanyByIdQuery, DefCompany>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetCompanyByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public Task<DefCompany> Handle(GetCompanyByIdQuery request, CancellationToken cancellationToken)
    {
        var Company = _applicationDbContext.DefCompanies.FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (Company != null)
            return Task.FromResult(Company);
        else
            return Task.FromResult(new DefCompany());

    }


}

