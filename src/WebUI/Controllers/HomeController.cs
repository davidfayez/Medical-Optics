using Duende.IdentityServer.Extensions;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Infrastructure.Common;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class HomeController : BaseController
{
    private readonly ICookieHandler _cookieHandler;
    private readonly string _creatorId;
    private readonly int _branchId;
    private readonly IApplicationDbContext _applicationDbContext;

    public HomeController(ICookieHandler cookieHandler,  IApplicationDbContext applicationDbContext)
    {
        _cookieHandler = cookieHandler;
        _applicationDbContext = applicationDbContext;
        _creatorId = _cookieHandler.Get("currentUserId");
        if (_creatorId.IsNullOrEmpty())
            _cookieHandler.RedirectToLogin();

    }

    public IActionResult Index()
    {
        return View();
    }
}
