using AutoMapper;
using Medical_Optics.Application.Def.City.Commands.Update;
using Medical_Optics.Application.Def.Nationality.Commands.Create;
using Medical_Optics.Application.Def.Nationality.Commands.Delete;
using Medical_Optics.Application.Def.Nationality.Commands.Update;
using Medical_Optics.Application.Def.Nationality.Queries.GetAll;
using Medical_Optics.Application.Def.Nationality.Queries.GetById;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class NationalityController : BaseController
{
    private readonly IMapper _mapper;

    public NationalityController(IMapper mapper)
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
        return View(new CreateNationalityCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateNationalityCommand command)
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
            var nationality = await Mediator.Send(new GetlNationalityByIdQuery
            {
                Id = id,
            });
            if (nationality != null)
            {
                var result = _mapper.Map<UpdateNationalityCommand>(nationality);
                return View(result);
            }
        }

        return View(new UpdateNationalityCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateNationalityCommand command)
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
        if (id > 0)
        {
            var isSuccess = await Mediator.Send(
              new DeleteNationalityCommand
              {
                  Id = id
              });
            return Json(isSuccess);
        }
        return Json(new DeleteNationalityCommand());
    }

    public async Task<JsonResult> GetAll()
    {
        var Nationalities = await Mediator.Send(new GetAllNationalityQuery());
        return Json(Nationalities);
    }
}
