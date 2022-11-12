using AutoMapper;
using MediatR;
using Medical_Optics.Application.Favorite.Complaint.Commands.Create;
using Medical_Optics.Application.Favorite.Complaint.Commands.Delete;
using Medical_Optics.Application.Favorite.Complaint.Queries.GetAll;
using Medical_Optics.Application.Favorite.Complaint.Queries.GetById;
using Medical_Optics.Application.Optic.Complaint.Commands.Delete;
using Medical_Optics.Application.Optic.Complaint.Commands.Update;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;
using Medical_Optics.Application.Optic.Diagnose.Commands.Create;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Medical_Optics.WebUI.Controllers;
public class FavoriteComplaintController : BaseController
{
    private readonly IMapper _mapper;
    public FavoriteComplaintController(IMapper mapper)
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
        return View(/*new CreateFavoriteComplaintCommand()*/);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateFavoriteComplaintCommand command)
    {
        if (ModelState.IsValid)
        {
            var isSuccess = await Mediator.Send(command);
            return isSuccess ? RedirectToAction("Index") : View(command);
        }
        return View(command);

    }

    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var FavotiteComplaint = await Mediator.Send(new GetFavotiteComplaintByIdQuery
            {
                Id = id,
            });
            if (FavotiteComplaint != null)
            {
                var command = _mapper.Map<CreateFavoriteComplaintCommand>(FavotiteComplaint);
                return View("Create", command);

            }
        }

        return View(new CreateFavoriteComplaintCommand());
    }


    [HttpPost]
    public async Task<JsonResult> DeleteAsync(int id)
    {
        var isSuccess = await Mediator.Send(
            new DeleteFavoriteComplaintCommand
            {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var FavoritesComplaints = await Mediator.Send(new GetAllFavoritesComplaintsQuery());
        return Json(FavoritesComplaints);
    }

    

}
