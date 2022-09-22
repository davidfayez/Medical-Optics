using ERP.DAL.Domains;
using Medical_Optics.Application.Common.Models;

namespace Medical_Optics.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

    Task<Result> DeleteUserAsync(string userId);

    Task<AspNetUser> AuthenticateUserAsync(string UserName, string Password, bool RememberMe);
    string GetUserRoleId(string id);
}
