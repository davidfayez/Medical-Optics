using AutoMapper;
using Medical_Optics.Application.Def.City.Commands.Create;
using Medical_Optics.Application.Def.City.Commands.Delete;
using Medical_Optics.Application.Def.City.Commands.Update;
using Medical_Optics.Application.Def.City.Queries.GetAll;
using Medical_Optics.Application.Def.City.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class CityController : BaseController
{
    private readonly IMapper _mapper;

    public CityController(IMapper mapper)
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
        return View(new CreateCityCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateCityCommand command)
    {
        if (ModelState.IsValid)
        {
            var isSuccess = await Mediator.Send(command);
            if (isSuccess)
                return View("Index");

        }
        return View(command);
    }
    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var city = await Mediator.Send(new GetCityByIdQuery
            {
                Id = id,
            });
            if (city != null)
            {
                var result = _mapper.Map<UpdateCityCommand>(city);
                return View(result);
            }
        }

        return View(new UpdateCityCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateCityCommand command)
    {
        if (ModelState.IsValid)
        {
            var isSuccess = await Mediator.Send(command);
            if (isSuccess)
                return View("Index");

        }
        return View(command);
    }

    [HttpPost]
    public async Task<JsonResult> DeleteAsync(int id)
    {
        var isSuccess = await Mediator.Send(
            new DeleteCityCommand
            {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var Citys = await Mediator.Send(new GetAllCitiesQuery());
        return Json(Citys);
    }
}
