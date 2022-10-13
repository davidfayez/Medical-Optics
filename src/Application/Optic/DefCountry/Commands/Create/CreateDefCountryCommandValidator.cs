using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Optic.DefCountry.Commands.Create;
internal class CreateDefCountryCommandValidator: AbstractValidator<CreateDefCountryCommand>
{
    public CreateDefCountryCommandValidator()
    {
        RuleFor(c => c.CountryCode).NotNull()
                      .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.CountryNameAr).NotNull()
                     .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.CountryNameEn).NotNull()
                    .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));

        RuleFor(e => e.CapitalNameAr).NotNull()
                    .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.CapitalNameEn).NotNull()
                    .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));
    }
}
