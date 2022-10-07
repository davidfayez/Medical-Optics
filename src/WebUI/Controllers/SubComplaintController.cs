using AutoMapper;
using Medical_Optics.Application.Optic.SubCompalint.Commands.Create;
using Medical_Optics.Application.Optic.SubCompalint.Commands.Delete;
using Medical_Optics.Application.Optic.SubCompalint.Commands.Update;
using Medical_Optics.Application.Optic.SubCompalint.Queries.GetAll;
using Medical_Optics.Application.Optic.SubCompalint.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class SubComplaintController : BaseController
{
    private readonly IMapper _mapper;

    public SubComplaintController(IMapper mapper)
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
        return View(new CreateSubComplaintCommand());
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateSubComplaintCommand command)
    {
        var isSuccess = await Mediator.Send(command);
        return isSuccess ? View("Index") : (IActionResult)View(command);
    }

    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var subCompalint = await Mediator.Send(new GetSubComplaintByIdQuery
            {
                Id = id,
            });
            if (subCompalint != null)
            {
                var result = _mapper.Map<UpdateSubComplaintCommand>(subCompalint);
                return View(result);
            }
        }

        return View(new UpdateSubComplaintCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateSubComplaintCommand command)
    {
        var isSuccess = await Mediator.Send(command);
        return isSuccess ? View("Index") : (IActionResult)View(command);
    }

    [HttpPost]
    public async Task<JsonResult> DeleteAsync(int id)
    {
        if (id > 0)
        {
            var isSuccess = await Mediator.Send(
              new DeleteSubComplaintCommand
              {
                  Id = id
              });
            return Json(isSuccess);
        }
        return Json(new DeleteSubComplaintCommand());
    }

    public async Task<JsonResult> GetAll()
    {
        var diagnose = await Mediator.Send(new GetAllSubCompalintQuery());
        return Json(diagnose);
    }

}
