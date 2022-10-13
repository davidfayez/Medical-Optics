using AutoMapper;
using Medical_Optics.Application.Optic.DefReligion.Commands.Create;
using Medical_Optics.Application.Optic.DefReligion.Commands.Delete;
using Medical_Optics.Application.Optic.DefReligion.Commands.Update;
using Medical_Optics.Application.Optic.DefReligion.Queries.GetAll;
using Medical_Optics.Application.Optic.DefReligion.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class DefReligionController : BaseController
{
    private readonly IMapper _mapper;

    public DefReligionController(IMapper mapper)
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
        return View(new CreateDefReligionCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateDefReligionCommand command)
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
            var religion = await Mediator.Send(new GetDefReligionByIdQuery
            {
                Id = id,
            });
            if (religion != null)
            {
                var result = _mapper.Map<UpdateDefReligionCommand>(religion);
                return View(result);
            }
        }

        return View(new UpdateDefReligionCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateDefReligionCommand command)
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
              new DeleteDefReligionCommand
              {
                  Id = id
              });
            return Json(isSuccess);
        }
        return Json(new DeleteDefReligionCommand());
    }

    public async Task<JsonResult> GetAll()
    {
        var religion = await Mediator.Send(new GetAllDefReligionQuery());
        return Json(religion);
    }
}
