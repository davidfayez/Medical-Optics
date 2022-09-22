using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Medical_Optics.Infrastructure.Services;
public class CookieHandler : ICookieHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CookieHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public void Add(string key, string value, int? expireTime)
    {
        CookieOptions option = new CookieOptions();
        if (expireTime.HasValue)
        {
            option.Expires = DateTime.Now.AddMinutes(expireTime.Value);
            _httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, option);
        }
        else
            _httpContextAccessor.HttpContext.Response.Cookies.Append(key, value);
    }

    public void Add(List<CookieType> cookies)
    {
        foreach (var cookie in cookies)
        {

            Add(cookie.Key, cookie.Value ?? "", cookie.ExpireTime);

        }
    }
    public string Get(string key)
    {
        if (CheckCookieExists(key))
            return _httpContextAccessor.HttpContext.Request.Cookies[key];
        return "0";
    }
    public void Delete(string key)
    {
        _httpContextAccessor.HttpContext.Response.Cookies.Delete(key);
    }
    public void DeleteAll(params string[] keys)
    {
        foreach (var key in keys)
        {
            Delete(key);
        }
    }
    public void DeleteAll()
    {
        foreach (var cookie in _httpContextAccessor.HttpContext.Request.Cookies.Keys)
        {
            _httpContextAccessor.HttpContext.Response.Cookies.Delete(cookie);
        }

    }
    public bool CheckCookieExists(string key)
    {
        return _httpContextAccessor.HttpContext.Request.Cookies[key] != null ? true : false;
    }

    public void RedirectToLogin()
    {
        _httpContextAccessor.HttpContext.Response.Redirect("Account/Login");
    }
}
