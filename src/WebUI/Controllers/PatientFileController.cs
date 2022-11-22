using MediatR;
using Medical_Optics.Application.Common.Enums;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;
using Medical_Optics.Application.Optic.PatientFile.Commands.Create;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetById;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientComplaints;
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
        command.PatientDataVM = await Mediator.Send(new GetPatientFileByIdQuery
        {
            Id = id.Value,
        });
        //command.PatientComplaintsVM = await Mediator.Send(new GetPatientComplaintsQuery
        //{
        //    ClientId = id.Value,
        //});
        FillDDL(command);
        return View(command);
    }

    [HttpPost]
    public async Task<IActionResult> GetEducationtypesByName(GetPatientFileByIdQuery getPatientFileByIdQuery)
    {
        var model = await Mediator.Send(getPatientFileByIdQuery);
        return PartialView("_CustomerData", model);
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
