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
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientDiagnosis;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Medical_Optics.Application.Optic.PatientFile.Commands.Create;
public class CreatePatientMedicalFileCommand : IRequest<bool>
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    //public int VisitNo { get; set; }
    public PatientDataVM PatientDataVM { get; set; } = new();
    public PatientComplaintVM? PatientComplaintVM { get; set; } = new();
    public PatientDiagnoseVM? PatientDiagnoseVM { get; set; }
    public List<PatientComplaintVM> ListPatientComplaints { get; set; }
    public List<PatientDiagnoseItemVM> ListPatientDiagnoseItems { get; set; }
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
            var PatientMedicalFile = new PatientMedicalFile();
            var PatientComplaint = new PatientComplaint();

            if (request.PatientDiagnoseVM != null)
            {
                var PatientDiagnose = _mapper.Map<PatientDiagnose>(request.PatientDiagnoseVM);
                PatientDiagnose.PatientDiagnoseItems = _mapper.Map<List<PatientDiagnoseItem>>(request.PatientDiagnoseVM.PatientDiagnoseItemsVM);
                CreatePatientDiagnose(request, PatientMedicalFile, PatientDiagnose);
            }
            
            if(request.PatientComplaintVM != null)
            {
                PatientComplaint.ComplaintName = request.PatientComplaintVM.ComplaintName;
                PatientComplaint.VisitNo = request.PatientComplaintVM.VisitNo;
                CreatePatientComplaint(request, PatientMedicalFile, PatientComplaint);
            }

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            if(request.PatientComplaintVM != null && request.PatientComplaintVM.PatientMedicalFileId == 0)
                request.Id = PatientMedicalFile.Id;

            if (request.PatientComplaintVM != null)
                request.PatientComplaintVM.Id = PatientComplaint.Id;

            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            return await Task.FromResult(false);
        }

    }

    private void CreatePatientComplaint(CreatePatientMedicalFileCommand request , PatientMedicalFile PatientMedicalFile , PatientComplaint PatientComplaint)
    {
        if (request.PatientComplaintVM.PatientMedicalFileId == 0)
        {
            PatientMedicalFile.ClientId = request.ClientId;
            PatientMedicalFile.PatientComplaints = new List<PatientComplaint>
                {
                    PatientComplaint
                };
            _applicationDbContext.PatientMedicalFiles.Add(PatientMedicalFile);

        }
        else
        {
            PatientMedicalFile = _applicationDbContext.PatientMedicalFiles
                                                         .FirstOrDefault(s => !s.IsDeleted
                                                         && s.Id == request.PatientComplaintVM.PatientMedicalFileId);
            if (PatientMedicalFile != null)
            {
                PatientMedicalFile.PatientComplaints = new List<PatientComplaint>
                    {
                        PatientComplaint
                    };
                _applicationDbContext.PatientMedicalFiles.Update(PatientMedicalFile);
            }
        }
    }

    private void CreatePatientDiagnose(CreatePatientMedicalFileCommand request, PatientMedicalFile PatientMedicalFile, PatientDiagnose PatientDiagnose)
    {
        if (request.PatientDiagnoseVM.PatientMedicalFileId == 0)
        {
            PatientMedicalFile.ClientId = request.ClientId;
            PatientMedicalFile.PatientDiagnosis = new List<PatientDiagnose>
                {
                    PatientDiagnose
                };
            _applicationDbContext.PatientMedicalFiles.Add(PatientMedicalFile);

        }
        else
        {
            PatientMedicalFile = _applicationDbContext.PatientMedicalFiles
                                                         .FirstOrDefault(s => !s.IsDeleted
                                                         && s.Id == request.PatientDiagnoseVM.PatientMedicalFileId);
            if (PatientMedicalFile != null)
            {
                PatientMedicalFile.PatientDiagnosis = new List<PatientDiagnose>
                    {
                        PatientDiagnose
                    };
                _applicationDbContext.PatientMedicalFiles.Update(PatientMedicalFile);
            }
        }
    }

}

