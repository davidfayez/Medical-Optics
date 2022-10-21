using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Def.City.Commands.Update;

namespace Medical_Optics.Application.HR.SocialStatus.Commands.Create;
public class CreateSocialStatusCommandValidator : AbstractValidator<CreateSocialStatusCommand>
{
    public CreateSocialStatusCommandValidator()
    {
        RuleFor(e => e.TypeCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.TypeNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.TypeNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));
    }
}
