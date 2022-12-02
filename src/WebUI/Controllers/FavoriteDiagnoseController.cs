using AutoMapper;
using Medical_Optics.Application.Favorite.Diagnose.Commands.Create;
using Medical_Optics.Application.Favorite.Diagnose.Commands.Delete;
using Medical_Optics.Application.Favorite.Diagnose.Queries.GetAll;
using Medical_Optics.Application.Favorite.Diagnose.Queries.GetById;
using Medical_Optics.Application.Favorite.Diagnose.Queries.GetDiagnosisByFavoriteId;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class FavoriteDiagnoseController : BaseController
{
    private readonly IMapper _mapper;
    public FavoriteDiagnoseController(IMapper mapper)
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
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateFavoriteDiagnoseCommand command)
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
            var FavotiteDiagnose = await Mediator.Send(new GetFavotiteDiagnosisByIdQuery
            {
                Id = id,
            });
            if (FavotiteDiagnose != null)
            {
                var command = _mapper.Map<CreateFavoriteDiagnoseCommand>(FavotiteDiagnose);
                return View("Create", command);

            }
        }

        return View(new CreateFavoriteDiagnoseCommand());
    }

    [HttpPost]
    public async Task<JsonResult> DeleteAsync(int id)
    {
        var isSuccess = await Mediator.Send(
            new DeleteFavoriteDiagnoseCommand
            {
                Id = id
            });
        return Json(isSuccess);
    }

    public async Task<JsonResult> GetAll()
    {
        var FavoritesDiagnoses = await Mediator.Send(new GetAllFavoritesDiagnosisQuery());
        return Json(FavoritesDiagnoses);
    }

    public async Task<JsonResult> GetDiagnosesByFavoriteId(int id)
    {
        var Diagnoses = await Mediator.Send(new GetDiagnosisByFavoriteIdQuery
        {
            FavoriteId = id,
        });
        var text = Diagnoses.Select(s => s.DiagnoseNameEn).ToList();
        return Json(text);
    }
}
