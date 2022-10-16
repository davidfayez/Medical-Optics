using AutoMapper;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.Currency.Commands.Create;
using Medical_Optics.Application.Def.Currency.Commands.Delete;
using Medical_Optics.Application.Def.Currency.Commands.Update;
using Medical_Optics.Application.Def.Currency.Queries.GetAll;
using Medical_Optics.Application.Def.Currency.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class CurrencyController : BaseController
{
    private readonly IMapper _mapper;
    private readonly IFileHandler _fileHandler;

    public CurrencyController(IMapper mapper, IFileHandler fileHandler)
    {
        _mapper = mapper;
        _fileHandler = fileHandler;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View(new CreateCurrencyCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateCurrencyCommand command)
    {
        if (ModelState.IsValid)
        {
            var isSuccess = await Mediator.Send(command);
            if (isSuccess)
                return RedirectToAction("Index");

        }
        return View(command);
    }
    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var complaint = await Mediator.Send(new GetCurrencyByIdQuery
            {
                Id = id,
            });
            if (complaint != null)
            {
                var result = _mapper.Map<UpdateCurrencyCommand>(complaint);
                return View(result);
            }
        }

        return View(new UpdateCurrencyCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateCurrencyCommand command)
    {
        if (ModelState.IsValid)
        {
            var isSuccess = await Mediator.Send(command);
            if (isSuccess)
                return RedirectToAction("Index");

        }
        return View(command);
    }

    [HttpPost]
    public async Task<JsonResult> DeleteAsync(int id)
    {
        var isSuccess = await Mediator.Send(
            new DeleteCurrencyCommand
            {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var Currencys = await Mediator.Send(new GetAllCurrenciesQuery());
        return Json(Currencys);
    }
}
