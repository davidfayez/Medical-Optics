using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.HR.SocialStatus.Commands.Create;
using Medical_Optics.Application.HR.SocialStatus.Commands.Delete;
using Medical_Optics.Application.HR.SocialStatus.Commands.Update;
using Medical_Optics.Application.HR.SocialStatus.Queries.GetAll;
using Medical_Optics.Application.HR.SocialStatus.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class SocialStatusController : BaseController
{
    private readonly IMapper _mapper;
    private readonly IFileHandler _fileHandler;

    public SocialStatusController(IMapper mapper, IFileHandler fileHandler)
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
        return View(new CreateSocialStatusCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateSocialStatusCommand command)
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
            var socialStatus = await Mediator.Send(new GetSocialStatusByIdQuery
            {
                Id = id,
            });
            if (socialStatus != null)
            {
                var result = _mapper.Map<UpdateSocialStatusCommand>(socialStatus);
                return View(result);
            }
        }

        return View(new UpdateSocialStatusCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateSocialStatusCommand command)
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
            new DeleteSocialStatusCommand
            {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var SocialStatuss = await Mediator.Send(new GetAllSocialStatusQuery());
        return Json(SocialStatuss);
    }
}
