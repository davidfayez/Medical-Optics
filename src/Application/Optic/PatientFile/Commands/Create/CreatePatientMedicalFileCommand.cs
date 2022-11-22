using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.CustomerData.Commands.Create;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetById;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientComplaints;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Medical_Optics.Application.Optic.PatientFile.Commands.Create;
public class CreatePatientMedicalFileCommand : IRequest<bool>
{
    public PatientDataVM PatientDataVM { get; set; } = new();
    public PatientComplaintVM PatientComplaintVM { get; set; } =new ();
    public int FavoriteComplaintId { get; set; }
    public int ComplaintId { get; set; }
    public int SubComplaintId { get; set; }
    public List<PatientComplaintVM> PatientComplaintsVM { get; set; }
    public List<SelectListItem> Sides { get; set; } = new();
    public List<SelectListItem> DiagnoseTypes { get; set; } = new();

}

public class CreatePatientMedicalFileCommandHandler : IRequestHandler<CreatePatientMedicalFileCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public CreatePatientMedicalFileCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(CreatePatientMedicalFileCommand request, CancellationToken cancellationToken)
    {
        try
        {
            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            return await Task.FromResult(false);
        }

    }
}

