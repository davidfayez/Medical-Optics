using AutoMapper;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;
using Medical_Optics.Application.Optic.Complaint.Commands.Update;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Medical_Optics.WebUI.Controllers;
public class ComplaintController : BaseController
{
    private readonly IMapper _mapper;
    public ComplaintController(IMapper mapper)
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
        return View(new CreateComplaintCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateComplaintCommand command)
    {
        //if(ModelState.IsValid)
        //{
            var isSuccess = await Mediator.Send(command);
            if(isSuccess)
                return View("Index");
        //}
        return View(command);
    }

    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var Complaint = await Mediator.Send(new GetComplaintByIdQuery
                                                {
                                                    Id = id,
                                                });
            if(Complaint != null)
            {
                var result = _mapper.Map<UpdateComplaintCommand>(Complaint);
                return View(result);
            }
        }

        return View(new UpdateComplaintCommand());
    }
    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateComplaintCommand command)
    {
        var isSuccess = await Mediator.Send(command);
        if (isSuccess)
            return View("Index");
        
        return View(command);
    }


}
