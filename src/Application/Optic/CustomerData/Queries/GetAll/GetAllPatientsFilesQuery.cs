using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
using Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;

namespace Medical_Optics.Application.Optic.CustomerData.Queries.GetAll;
public class GetAllPatientsFilesQuery : IRequest<List<CustomerDataVM>>
{
    public string? CustomerMRN { get; set; }
    public string? ClientName { get; set; }
    public string? IDNumber { get; set; }                   //رقم الاقامة / الهوية الوطنية 

}

public class GetAllPatientsFilesQueryHandler : IRequestHandler<GetAllPatientsFilesQuery, List<CustomerDataVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllPatientsFilesQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<CustomerDataVM>> Handle(GetAllPatientsFilesQuery request, CancellationToken cancellationToken)
    {
        var PatientsFiles = _applicationDbContext.CustomersData.Where(s => !s.IsDeleted);

        if (!string.IsNullOrEmpty(request.ClientName))
            PatientsFiles = PatientsFiles.Where(s => s.CustomerNameEn.ToLower().Contains(request.ClientName.ToLower()));

        if (!string.IsNullOrEmpty(request.IDNumber))
            PatientsFiles = PatientsFiles.Where(s => s.IDNumber.Contains(request.IDNumber));

        if (!string.IsNullOrEmpty(request.CustomerMRN))
            PatientsFiles = PatientsFiles.Where(s => s.CustomerMRN == request.CustomerMRN);

        var PatientsFilesVMs = _mapper.Map<List<CustomerDataVM>>(PatientsFiles.ToList());
        PatientsFilesVMs.ForEach(s => s.ImageUrl = s.ImageUrl != null ? "CustomerData/" + s.ImageUrl : "back-login.jpg");
        return Task.FromResult(PatientsFilesVMs);
    }
}
