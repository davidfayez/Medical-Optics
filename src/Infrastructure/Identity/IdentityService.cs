using ERP.DAL.Domains;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Medical_Optics.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<AspNetUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<AspNetUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly SignInManager<AspNetUser> _signInManager;

    public IdentityService(
        UserManager<AspNetUser> userManager,
        IUserClaimsPrincipalFactory<AspNetUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService,
        IApplicationDbContext applicationDbContext,
        SignInManager<AspNetUser> signInManager)
    {
        _userManager = userManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
        _applicationDbContext = applicationDbContext;
        _signInManager = signInManager;
    }

    public async Task<string> GetUserNameAsync(string userId)
    {
        var user = await _userManager.Users.FirstAsync(u => u.Id == userId);

        return user.UserName;
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password)
    {
        var user = new AspNetUser
        {
            UserName = userName,
            Email = userName,
        };

        var result = await _userManager.CreateAsync(user, password);

        return (result.ToApplicationResult(), user.Id);
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return false;
        }

        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        var result = await _authorizationService.AuthorizeAsync(principal, policyName);

        return result.Succeeded;
    }

    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        return user != null ? await DeleteUserAsync(user) : Result.Success();
    }

    public async Task<Result> DeleteUserAsync(AspNetUser user)
    {
        var result = await _userManager.DeleteAsync(user);

        return result.ToApplicationResult();
    }

    public async Task<AspNetUser> AuthenticateUserAsync(string UserName, string Password ,bool RememberMe)
    {
        try
        {
            var result = await _signInManager.PasswordSignInAsync(UserName, Password, RememberMe, false);

            if (result.Succeeded)
                return _applicationDbContext.AspNetUsers.FirstOrDefault(s => s.UserName == UserName && s.Password == Password && !s.IsDeleted);
            return (new AspNetUser());
        }
        catch (Exception ex)
        {

            throw;
        }
        
    }

    public string GetUserRoleId(string id)
    {
        return _applicationDbContext.AspNetUserRoles.FirstOrDefault(s => s.UserId == id).RoleId;
    }

    //public int GetEmployeeId(string id)
    //{
    //    return _applicationDbContext.AspNetUsers.FirstOrDefault(s => s.Id == id).FkHrEmployeeId;
    //}
}
