using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Def.Currency.Commands.Create;

namespace Medical_Optics.Application.Def.Currency.Commands.Update;
public class UpdateCurrencyCommandValidator : AbstractValidator<UpdateCurrencyCommand>
{
    public UpdateCurrencyCommandValidator()
    {
        RuleFor(e => e.Code).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.CurrencyNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.CurrencyNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));

        RuleFor(e => e.AbbreviationAr).NotNull()
               .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.AbbreviationAr));

        RuleFor(e => e.AbbreviationEn).NotNull()
               .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.AbbreviationEn));

        RuleFor(e => e.DefaultFactor).NotNull()
               .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.DefaultFactor));
        
    }
}
