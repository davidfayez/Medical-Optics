using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Application.Common.Interfaces;
public interface ICookieHandler
{
    /// <summary>  
    /// Add the cookie  
    /// </summary>  
    /// <param name="key">key (unique indentifier)</param>  
    /// <param name="value">value to store in cookie object</param>  
    /// <param name="expireTime">expiration time</param>  
    void Add(string key, string value, int? expireTime);
    void Add(List<CookieType> cookies);
    /// <summary>  
    /// Get the cookie  
    /// </summary>  
    /// <param name="key">Key </param>  
    /// <returns>string value</returns>  
    string Get(string key);

    /// <summary>  
    /// Delete the key  
    /// </summary>  
    /// <param name="key">Key</param>  
    void Delete(string key);
    void DeleteAll(params string[] keys);
    void DeleteAll();

    bool CheckCookieExists(string key);

    void RedirectToLogin();
}

public class CookieType
{
    public string Key { get; set; }
    public string Value { get; set; }
    public int? ExpireTime { get; set; }
}
