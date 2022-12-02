using MediatR;
using Medical_Optics.Application.Common.Enums;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;
using Medical_Optics.Application.Optic.Diagnose.Commands.Create;
using Medical_Optics.Application.Optic.PatientFile.Commands.Create;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetById;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetNextVisit;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientComplaints;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientDiagnoseItems;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientDiagnosis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Medical_Optics.WebUI.Controllers;
public class PatientFileController : BaseController
{
    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    public async Task<IActionResult> CreateAsync(int? id)
    {
        var command = new CreatePatientMedicalFileCommand();
        if (id != null)
        {
            command.PatientDataVM = await Mediator.Send(new GetPatientFileByIdQuery
            {
                Id = id.Value,
            });
            
            command.ListPatientComplaints = await Mediator.Send(new GetPatientComplaintsQuery
            {
                ClientId = id.Value,
            });

            if(command.ListPatientComplaints != null)
                command.PatientComplaintVM.PatientMedicalFileId = command.ListPatientComplaints[0].PatientMedicalFileId;

            command.PatientComplaintVM.VisitNo = await Mediator.Send(new GetNextVisitByPatientIdQuery
            {
                ClientId = id.Value,
            });

            command.PatientDataVM.VisitNo = command.PatientComplaintVM.VisitNo;
            command.ClientId = id.Value;
            FillDDL(command);
            return View(command);
        }
        return View(command);
        
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreatePatientMedicalFileCommand command)
    {
        if (ModelState.IsValid)
        {
            command.PatientDiagnoseVM = null;
            var isSuccess = await Mediator.Send(command);
            if (isSuccess)
            {
                FillDDL(command);
                command.ListPatientComplaints = await Mediator.Send(new GetPatientComplaintsQuery
                {
                    ClientId = command.ClientId,
                });
                return PartialView("_Complaint", command);
            }
        }
        return PartialView("_Complaint", command);


    }

    [HttpPost]
    public async Task<IActionResult> GetEducationtypesByName(GetPatientFileByIdQuery getPatientFileByIdQuery)
    {
        var model = await Mediator.Send(getPatientFileByIdQuery);
        return PartialView("_CustomerData", model);
    }

    [HttpPost]
    public async Task<IActionResult> SaveDiagnosisAsync([FromBody] PatientDiagnoseVM patientDiagnoseVM )
    {
        if (patientDiagnoseVM != null)
        {
            var command = new CreatePatientMedicalFileCommand
            {
                PatientComplaintVM = null,
                PatientDiagnoseVM = patientDiagnoseVM,
                ClientId = patientDiagnoseVM.ClientId,
                Id = patientDiagnoseVM.PatientMedicalFileId,
            };
            var isSuccess = await Mediator.Send(command);

            if (isSuccess)
            {
                //command.ListPatientDiagnoseItems = await Mediator.Send(new GetPatientDiagnoseItemsQuery
                //{
                //    ClientId = command.ClientId,
                //});
                //FillDDL(command);
                //return PartialView("_Diagnosis", command);
                return Json(true);

            }
            //return Json(true);
        }
        return Json(false);
    }

    private void FillDDL(CreatePatientMedicalFileCommand command)
    {
        //command.Sides.Add(new SelectListItem { Text = Global.SelectOne, Value = "" });
        command.Sides.Add(new SelectListItem { Text = nameof(Side.None), Value = ((int)Side.None).ToString() });
        command.Sides.Add(new SelectListItem { Text = nameof(Side.Right), Value = ((int)Side.Right).ToString() });
        command.Sides.Add(new SelectListItem { Text = nameof(Side.Left), Value = ((int)Side.Left).ToString() });
        command.Sides.Add(new SelectListItem { Text = nameof(Side.Bilateral), Value = ((int)Side.Bilateral).ToString() });

        //command.DiagnoseTypes.Add(new SelectListItem { Text = Global.SelectOne, Value = "" });
        command.DiagnoseTypes.Add(new SelectListItem { Text = nameof(DiagnoseType.Principal), Value = ((int)DiagnoseType.Principal).ToString() });
        command.DiagnoseTypes.Add(new SelectListItem { Text = nameof(DiagnoseType.Secondary), Value = ((int)DiagnoseType.Secondary).ToString() });

    }
}
