using AutoMapper;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;
using Medical_Optics.Application.Optic.Complaint.Commands.Delete;
using Medical_Optics.Application.Optic.Complaint.Commands.Update;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class ComplaintController : BaseController
{
    private readonly IMapper _mapper;
    private readonly IFileHandler _fileHandler;

    public ComplaintController(IMapper mapper, IFileHandler fileHandler)
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
        return View(new CreateComplaintCommand());
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateComplaintCommand command)
    {
        if(ModelState.IsValid)
        {
        var ComplaintImagePath = (command.ComplaintImage != null) ? command.ComplaintCode + command.ComplaintImage.FileName.Substring(command.ComplaintImage.FileName.LastIndexOf('.')) : null;
        command.ComplaintImagePath = ComplaintImagePath;
        var isSuccess = await Mediator.Send(command);
        if(isSuccess)
        {
            if (ComplaintImagePath != null)
                _fileHandler.UploadFile("Complaints", command.ComplaintImage, command.ComplaintCode.ToString());
            
            return View("Index");
        }
        }
        return View(command);
    }
    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var complaint = await Mediator.Send(new GetComplaintByIdQuery
            {
                Id = id,
                                                });
            if(complaint != null)
            {
                var result = _mapper.Map<UpdateComplaintCommand>(complaint);
                return View(result);
            }
        }

        return View(new UpdateComplaintCommand());
    }

    [HttpPost]
    public async Task<IActionResult> EditAsync(UpdateComplaintCommand command)
    {
        if (ModelState.IsValid)
        {
            var complaintImagePath = (command.ComplaintImage != null) ? command.ComplaintCode + command.ComplaintImage.FileName.Substring(command.ComplaintImage.FileName.LastIndexOf('.')) : null;
            if (complaintImagePath != null)
                command.ComplaintImagePath = complaintImagePath;

            var isSuccess = await Mediator.Send(command);
            if (isSuccess)
            {
                if (complaintImagePath != null)
                    _fileHandler.UploadFile("Complaints", command.ComplaintImage, command.ComplaintCode.ToString());

                return View("Index");
            }
        }
        return View(command);
    }

    [HttpPost]
    public async Task<JsonResult> DeleteAsync(int id)
    {
        var isSuccess = await Mediator.Send(
            new DeleteComplaintCommand {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var Complaints = await Mediator.Send(new GetAllComplaintsQuery());
        return Json(Complaints);
    }
}
