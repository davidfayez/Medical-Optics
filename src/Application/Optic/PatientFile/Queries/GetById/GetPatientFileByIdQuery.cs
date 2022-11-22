using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.CustomerData.Commands.Create;
using Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
using Medical_Optics.Application.Optic.CustomerData.Queries.GetById;
using DB = Medical_Optics.Domain.Entities.Optic;
namespace Medical_Optics.Application.Optic.PatientFile.Queries.GetById;
public class GetPatientFileByIdQuery : IRequest<PatientDataVM>
{
    public int Id { get; set; }
    public string MRN { get; set; }
}

public class GetPatientFileByIdQueryHandler : IRequestHandler<GetPatientFileByIdQuery, PatientDataVM>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetPatientFileByIdQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<PatientDataVM> Handle(GetPatientFileByIdQuery request, CancellationToken cancellationToken)
    {
        var AllCustomerData = _applicationDbContext.CustomersData
                                                .Include(s => s.Nationality)
                                                .Include(s => s.Religion)
                                                .Include(s => s.SocialStatus)
                                                .Include(s => s.MedicalInsurance)
                                                .Include(s => s.NationalAddress)
                                                .Where(s =>!s.IsDeleted);

        var CustomerData = new DB.CustomerData();
        if (request.MRN != null)
            CustomerData = AllCustomerData.FirstOrDefault(s => s.CustomerMRN == request.MRN);
        else
            CustomerData = AllCustomerData.FirstOrDefault(s => s.Id == request.Id);


        if (CustomerData != null)
        {
            var PatientDataVM = _mapper.Map<PatientDataVM>(CustomerData);

            PatientDataVM.ImageUrl = CustomerData.ImageUrl != null ? "CustomerData/" + CustomerData.ImageUrl : "back-login.jpg";

            if (CustomerData.MedicalInsurance != null)
            {
                PatientDataVM.MedicalImageUrl = CustomerData.MedicalInsurance.CardImageUrl != null ? "MedicalInsurance/" + CustomerData.MedicalInsurance.CardImageUrl : "back-login.jpg";
            }
            else
                PatientDataVM.MedicalImageUrl = "back-login.jpg";

            return Task.FromResult(PatientDataVM);
        }
        else
            return Task.FromResult(new PatientDataVM());

    }


}

