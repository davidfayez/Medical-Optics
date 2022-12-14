using AutoMapper;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
using Medical_Optics.Application.Optic.Diagnose.Commands.Create;
using Medical_Optics.Application.Optic.Diagnose.Commands.Delete;
using Medical_Optics.Application.Optic.Diagnose.Commands.Update;
using Medical_Optics.Application.Optic.Diagnose.Queries.GetAll;
using Medical_Optics.Application.Optic.Diagnose.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class DiagnoseController : BaseController    
{
    private readonly IMapper _mapper;

    public DiagnoseController(IMapper mapper)
    {
        _mapper = mapper;
    }
    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View(new CreateDiagnoseCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateDiagnoseCommand command)
    {
        if (ModelState.IsValid)
        {
            var isSuccess = await Mediator.Send(command);
            return isSuccess ? View("Index") : (IActionResult)View(command);
        }
        return View(command);

    }

    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var diagnose = await Mediator.Send(new GetDiagnoseByIdQuery
            {
                Id = id,
            });
            if (diagnose != null)
            {
                var result = _mapper.Map<UpdateDiagnoseCommand>(diagnose);
                return View(result);
            }
        }

        return View(new UpdateDiagnoseCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateDiagnoseCommand command)
    {
        if (ModelState.IsValid)
        {
            var isSuccess = await Mediator.Send(command);
            return isSuccess ? View("Index") : (IActionResult)View(command);
        }
        return View(command);

    }

    [HttpPost]
    public async Task<JsonResult> DeleteAsync(int id)
    {
        if(id > 0)
        {
            var isSuccess = await Mediator.Send(
              new DeleteDiagnoseCommand
                {
                    Id = id
                });
            return Json(isSuccess);
        }
        return Json(new DeleteDiagnoseCommand());
    }

    public async Task<JsonResult> GetAll()
    {
        var diagnose = await Mediator.Send(new GetAllDiagnoseQuery());
        return Json(diagnose);
    }

    public async Task<JsonResult> GetAllOptional(string selectedIds)
    {
        List<int> optionalListIds = null;

        if (selectedIds != null)
            optionalListIds = selectedIds.Split(',').Select(Int32.Parse).ToList();

        var Complaints = await Mediator.Send(new GetAllDiagnoseQuery
        {
            OptionalIds = optionalListIds
        });

        return Json(Complaints);
    }

    public async Task<JsonResult> GetAllSelected(string selectedIds)
    {
        List<int> selectedListIds = null;

        if (selectedIds != null)
            selectedListIds = selectedIds.Split(',').Select(Int32.Parse).ToList();

        var Complaints = await Mediator.Send(new GetAllDiagnoseQuery
        {
            SelectedIds = selectedListIds
        });

        return Json(Complaints);
    }

}
