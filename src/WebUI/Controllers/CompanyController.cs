using AutoMapper;
using Medical_Optics.Application.Def.Company.Commands.Create;
using Medical_Optics.Application.Def.Company.Commands.Delete;
using Medical_Optics.Application.Def.Company.Commands.Update;
using Medical_Optics.Application.Def.Company.Queries.GetAll;
using Medical_Optics.Application.Def.Company.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class CompanyController : BaseController
{
    private readonly IMapper _mapper;

    public CompanyController(IMapper mapper)
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
        return View(new CreateCompanyCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateCompanyCommand command)
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
            var complaint = await Mediator.Send(new GetCompanyByIdQuery
            {
                Id = id,
            });
            if (complaint != null)
            {
                var result = _mapper.Map<UpdateCompanyCommand>(complaint);
                return View(result);
            }
        }

        return View(new UpdateCompanyCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateCompanyCommand command)
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
            new DeleteCompanyCommand
            {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var Companys = await Mediator.Send(new GetAllCompaniesQuery());
        return Json(Companys);
    }
}
