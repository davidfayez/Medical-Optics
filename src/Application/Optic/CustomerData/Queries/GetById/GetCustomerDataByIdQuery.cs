using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;
using Medical_Optics.Application.Optic.CustomerData.Commands.Create;
using Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
using Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.CustomerData.Queries.GetById;
public class GetCustomerDataByIdQuery : IRequest<CreateCustomerDataCommand>
{
    public int Id { get; set; }
}

public class GetCustomerDataByIdQueryHandler : IRequestHandler<GetCustomerDataByIdQuery, CreateCustomerDataCommand>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetCustomerDataByIdQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<CreateCustomerDataCommand> Handle(GetCustomerDataByIdQuery request, CancellationToken cancellationToken)
    {
        var command = new CreateCustomerDataCommand();

        var CustomerData = _applicationDbContext.CustomersData.Include(s=>s.MedicalInsurance)
                                                              .Include(s=>s.NationalAddress)
                                                              .FirstOrDefault(s => s.Id == request.Id && !s.IsDeleted);

        if (CustomerData != null)
        {
            command.CustomerDataVM = _mapper.Map<CustomerDataVM>(CustomerData);

            command.CustomerDataVM.ImageUrl = CustomerData.ImageUrl != null ? "CustomerData/" + CustomerData.ImageUrl : "back-login.jpg";
            
            if(CustomerData.NationalAddress != null)
                command.NationalAddressVM = _mapper.Map<NationalAddressVM>(CustomerData.NationalAddress);

            if (CustomerData.MedicalInsurance != null)
            {
                command.MedicalInsuranceVM = _mapper.Map<MedicalInsuranceVM>(CustomerData.MedicalInsurance);
                command.MedicalInsuranceVM.CardImageUrl = command.MedicalInsuranceVM.CardImageUrl != null ? "MedicalInsurance/" + command.MedicalInsuranceVM.CardImageUrl : "back-login.jpg";

            }

            return Task.FromResult(command);
        }
        else
            return Task.FromResult(new CreateCustomerDataCommand());

    }

    
}

