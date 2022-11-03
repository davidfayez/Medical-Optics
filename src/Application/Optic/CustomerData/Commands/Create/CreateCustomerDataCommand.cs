using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;
using Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
using Medical_Optics.Domain.Entities.Optic;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.CustomerData.Commands.Create;
public class CreateCustomerDataCommand : IRequest<bool>
{
    public CustomerDataVM CustomerDataVM { get; set; } = new();
    public NationalAddressVM NationalAddressVM { get; set; } = new();
    public MedicalInsuranceVM MedicalInsuranceVM { get; set; } = new();
}

public class CreateCustomerDataCommandHandler : IRequestHandler<CreateCustomerDataCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreateCustomerDataCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreateCustomerDataCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var customerData = _mapper.Map<DB.CustomerData>(request.CustomerDataVM);

            if (request.MedicalInsuranceVM != null)
            {
                var medicalInsurance = _mapper.Map<MedicalInsurance>(request.MedicalInsuranceVM);
                customerData.MedicalInsurance = medicalInsurance;
            }

            if (request.NationalAddressVM != null)
            {
                var nationalAddress = _mapper.Map<NationalAddress>(request.NationalAddressVM);
                customerData.NationalAddress = nationalAddress;
            }

            if (request.CustomerDataVM.Id > 0)
                _applicationDbContext.CustomersData.Update(customerData);
            else
                _applicationDbContext.CustomersData.Add(customerData);

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            return await Task.FromResult(false);
            //throw;
        }

    }
}

