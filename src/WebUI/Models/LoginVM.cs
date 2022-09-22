using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Medical_Optics.WebUI.Models;

public class LoginVM
{
    public LoginVM()
    {
        Branchs = new List<SelectListItem>();
    }

    [Required(ErrorMessageResourceType = typeof(Application.Common.Resources.ErrorMessages), ErrorMessageResourceName = "Required")]
    [Display(Name = "UserName", ResourceType = typeof(Application.Common.Resources.Global))]
    public string UserName { get; set; }

    [DataType(DataType.Password)]
    [Required(ErrorMessageResourceType = typeof(Application.Common.Resources.ErrorMessages), ErrorMessageResourceName = "Required")]
    [Display(Name = "Password", ResourceType = typeof(Application.Common.Resources.Global))]
    public string Password { get; set; }

    [Display(Name = "RememberMe", ResourceType = typeof(Application.Common.Resources.Global))]
    public bool RememberMe { get; set; }

    [Required(ErrorMessageResourceType = typeof(Application.Common.Resources.ErrorMessages), ErrorMessageResourceName = "Required")]
    [Display(Name = "Branch")]
    public int FK_DefBranchId { get; set; }
    public List<SelectListItem> Branchs { get; set; }
}
