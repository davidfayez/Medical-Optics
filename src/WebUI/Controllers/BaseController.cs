using MediatR;
using Medical_Optics.Application.Common.Exceptions;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;

namespace Medical_Optics.WebUI.Controllers;
public class BaseController : Controller
{
    private ISender _mediator;
    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetService<ISender>();
    protected bool? IsArabicCulture => Request.HttpContext.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name.Contains("ar");

    protected void UpdateModelState(ValidationException ex)
    {
        ex.Errors.ToList().ForEach(err =>
        {
            err.Value.ToList().ForEach(val =>
            {
                ModelState.AddModelError(err.Key, val);
            });
        });
    }
}
