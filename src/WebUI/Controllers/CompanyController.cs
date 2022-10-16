using AutoMapper;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Def.Company.Commands.Create;
using Medical_Optics.Application.Def.Company.Commands.Delete;
using Medical_Optics.Application.Def.Company.Commands.Update;
using Medical_Optics.Application.Def.Company.Queries.GetAll;
using Medical_Optics.Application.Def.Company.Queries.GetById;
using Medical_Optics.Application.Def.Company.Queries.GetCompany;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class CompanyController : BaseController
{
    private readonly IMapper _mapper;
    private readonly IFileHandler _fileHandler;


    public CompanyController(IMapper mapper, IFileHandler fileHandler)
    {
        _mapper = mapper;
        _fileHandler = fileHandler;
    }
    [HttpGet]
    public async Task<IActionResult> IndexAsync()
    {
        var company = await Mediator.Send(new GetCompanyQuery());
        var result = _mapper.Map<UpdateCompanyCommand>(company);

        if (company != null && company.LogoUrl != null)
        {
            ViewBag.compImage = "images/Company/" + company.LogoUrl;
        }
        else
        {
            ViewBag.compImage = "images/back-login.jpg";
        }
        TempData["Saved"] = "";
        return View(result);
    }

    [HttpPost]
    public async Task<IActionResult> IndexAsync(UpdateCompanyCommand command)
    {
        var defCompany = await Mediator.Send(new GetCompanyQuery());
        if (command.CompanyImage != null)
        {
            command.LogoUrl = _fileHandler.UploadFile("Company", command.CompanyImage, null, command.LogoUrl != null ? command.LogoUrl : null);

        }
        if (defCompany != null)
        {
            if (await Mediator.Send(command))
                TempData["Saved"] = "SavedSuccessfully";
        }
        else
        {
          
           var  createdCommand = _mapper.Map<CreateCompanyCommand>(command);

            if (await Mediator.Send(createdCommand))
                TempData["Saved"] = "SavedSuccessfully";
        }
        var company = await Mediator.Send(new GetCompanyQuery());
        if (company != null && company.LogoUrl != null)
        {
            ViewBag.compImage = "images/Company/" + company.LogoUrl;
        }
        else
        {
            ViewBag.compImage = "images/back-login.jpg";
        }
        return View(company);
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
            var company = await Mediator.Send(new GetCompanyByIdQuery
            {
                Id = id,
            });
            if (company != null)
            {
                var result = _mapper.Map<UpdateCompanyCommand>(company);
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
