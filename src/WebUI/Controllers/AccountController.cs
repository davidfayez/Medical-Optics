using AutoMapper;
using Medical_Optics.Application.Branches.Queries.GetAll;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.WebUI.Controllers;
using Medical_Optics.WebUI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Medical_Optics.WebUI.Controllers;

public class AccountController : BaseController
{


    private readonly IIdentityService _identityService;
    private readonly IMapper _mapper;
    private readonly ICookieHandler _cookieHandler;
    //private readonly IHrEmployeeBLL _hrEmployeeBLL;
    public string ReturnUrl;

    private readonly string _creatorId;

    public AccountController(
                                IIdentityService identityService,
                                ICookieHandler cookieHandler,
                                IMapper mapper
        //,IHrEmployeeBLL hrEmployeeBLL
        )

    {
        _identityService = identityService;
        _cookieHandler = cookieHandler;
        _mapper = mapper;
        //_hrEmployeeBLL = hrEmployeeBLL;
        _creatorId = _cookieHandler.Get("curentReqUserId");

    }
    // GET: /<controller>/
    public IActionResult Index()
    {
        return View();
    }

    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        _cookieHandler.DeleteAll("userImagePath", "curentUserId", "creatorName", "hrEmployeeBranch", "hrEmployeeId");
        HttpContext.Session.Clear();
        return RedirectToAction("Login", "Account");
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Login()
    {
        var userHasAccess = TempData["HasAccess"];
        if (userHasAccess != null)
            ViewData.ModelState.AddModelError("FK_DefBranchId", "User Has No Access To This Branch" /* Utilities.Resources.ErrorMessages.UserNameValidation*/);

        LoginVM loginVM = new LoginVM();
        var defBranches = await Mediator.Send(new GetAllBranchesQuery());
        loginVM.Branchs.Add(new SelectListItem() { Disabled = false, Selected = true, Text = "Choose Branch", Value = "" });
        loginVM.Branchs.AddRange(defBranches.Select(x => new SelectListItem() { Disabled = false, Text = x.BranchNameEn, Value = x.Id.ToString() }));

        return View(loginVM);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginVM model, string? returnUrl)
    {
        ReturnUrl = returnUrl;
        if (ModelState.IsValid)
        {

            var user =await _identityService.AuthenticateUserAsync(model.UserName, model.Password, model.RememberMe);

            if (user != null)
            {
                var userRoleId = _identityService.GetUserRoleId(user.Id);
                #region Set Cookies
                var cookies = new List<CookieType>();
                cookies.Add(new CookieType { Key = "userImagePath", Value = user.Image, ExpireTime = null });
                cookies.Add(new CookieType { Key = "creatorName", Value = Convert.ToString(user.FullName), ExpireTime = null });
                cookies.Add(new CookieType { Key = "currentUserId", Value = Convert.ToString(user.Id), ExpireTime = null });
                //cookies.Add(new CookieType { Key = "hrEmployeeBranch", Value = Convert.ToString(_hrEmployeeBLL.GetById(user.FK_HrEmployeeId).BranchName), ExpireTime = null });
                cookies.Add(new CookieType { Key = "userType", Value = userRoleId, ExpireTime = null });
                //cookies.Add(new CookieType { Key = "AnsariERPLang", Value = "c=en-US|uic=en-US", ExpireTime = 260000 });
                var culture = _cookieHandler.CheckCookieExists("AnsariERPLang");
                if (!culture)
                    _cookieHandler.Add("AnsariERPLang", "c=en-US|uic=en-US", 260000);

                _cookieHandler.Add(cookies);
                #endregion
                var claims = new List<Claim>
                      {
                          new Claim(ClaimTypes.Name, user.UserName)
                      };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    new AuthenticationProperties
                    {
                        IsPersistent = model.RememberMe
                    });

                if (!string.IsNullOrEmpty(returnUrl))
                    return Redirect(returnUrl);
                else
                    return Redirect("~/Home/Index");


            }
            else
                ModelState.AddModelError("CustomError", "برجاء ادخال كلمه المرور.");
        }

        return View(model);
    }

    [HttpGet]
    public IActionResult ChangePassword()
    {
        return View();
    }

    //[HttpPost]
    //public IActionResult ChangePassword(ChangePasswordVM changePasswordVM)
    //{

    //    if (ModelState.IsValid)
    //    {
    //        if (changePasswordVM.NewPassword != changePasswordVM.ConfirmNewPassword)
    //        {
    //            ModelState.AddModelError(string.Empty, "كلمه المرور غير متطابقة.");
    //            return View();
    //        }

    //        changePasswordVM.UserId = _creatorId;
    //        if (_requestUserBLL.ChangePassword(changePasswordVM))
    //            return RedirectToAction("Login");
    //        else
    //        {
    //            ModelState.AddModelError(string.Empty, "كلمه المرور القديمة غير صحيحة.");
    //            return View();
    //        }
    //    }

    //    return View();
    //}

    public ActionResult UnauthorizedUser()
    {
        return View();
    }

    public ActionResult SwitchLanguage()
    {
        try
        {
            var culture = _cookieHandler.CheckCookieExists("AnsariReqLang");
            if (!culture)
                _cookieHandler.Add("AnsariReqLang", "c=ar|uic=ar", 260000);

            else if (_cookieHandler.Get("AnsariReqLang") == "c=en-US|uic=en-US")
                _cookieHandler.Add("AnsariReqLang", "c=ar|uic=ar", 260000);

            else
                _cookieHandler.Add("AnsariReqLang", "c=en-US|uic=en-US", 260000);
        }
        catch
        {
        }


        return Redirect(Request.Headers["Referer"].ToString());
    }
}
