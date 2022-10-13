using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Def.City.Commands.Create;

namespace Medical_Optics.Application.Def.City.Commands.Update;
public class UpdateCityCommandValidator : AbstractValidator<UpdateCityCommand>
{
    public UpdateCityCommandValidator()
    {
        RuleFor(e => e.CityCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.CityNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.CityNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));

        RuleFor(e => e.GovernorateNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.GovernorateNameAr));

        RuleFor(e => e.GovernorateNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.GovernorateNameEn));
    }
}
