using AutoMapper;
using Medical_Optics.Application.Optic.DefCountry.Commands.Create;
using Medical_Optics.Application.Optic.DefCountry.Commands.Delete;
using Medical_Optics.Application.Optic.DefCountry.Commands.Update;
using Medical_Optics.Application.Optic.DefCountry.Queries.GetAll;
using Medical_Optics.Application.Optic.DefCountry.Queries.GetById;
using Medical_Optics.Application.Optic.Diagnose.Commands.Delete;
using Medical_Optics.Application.Optic.Diagnose.Commands.Update;
using Medical_Optics.Application.Optic.Diagnose.Queries.GetAll;
using Medical_Optics.Application.Optic.Diagnose.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class DefCountryController : BaseController
{
    private readonly IMapper _mapper;

    public DefCountryController(IMapper mapper)
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
        return View(new CreateDefCountryCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateDefCountryCommand command)
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
            var country = await Mediator.Send(new GetDefCountryByIdQuery
            {
                Id = id,
            });
            if (country != null)
            {
                var result = _mapper.Map<UpdateDefCountryCommand>(country);
                return View(result);
            }
        }

        return View(new UpdateDefCountryCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateDefCountryCommand command)
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
              new DeleteDefCountryCommand
              {
                  Id = id
              });
            return Json(isSuccess);
        }
        return Json(new DeleteDefCountryCommand());
    }

    public async Task<JsonResult> GetAll()
    {
        var country = await Mediator.Send(new GetAllDefCountryQuery());
        return Json(country);
    }

}
