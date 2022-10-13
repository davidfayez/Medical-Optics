using AutoMapper;
using Medical_Optics.Application.Branches.Queries.GetAll;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.Branch.Commands.Create;
using Medical_Optics.Application.Def.Branch.Commands.Delete;
using Medical_Optics.Application.Def.Branch.Commands.Update;
using Medical_Optics.Application.Def.Branch.Queries.GetById;
using Medical_Optics.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class BranchController : BaseController
{
    private readonly IMapper _mapper;

    public BranchController(IMapper mapper)
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
        return View(new CreateBranchCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateBranchCommand command)
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
            var complaint = await Mediator.Send(new GetBranchByIdQuery
            {
                Id = id,
            });
            if (complaint != null)
            {
                var result = _mapper.Map<UpdateBranchCommand>(complaint);
                return View(result);
            }
        }

        return View(new UpdateBranchCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateBranchCommand command)
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
            new DeleteBranchCommand
            {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var Branchs = await Mediator.Send(new GetAllBranchesQuery());
        return Json(Branchs);
    }
}
