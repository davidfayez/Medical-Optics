using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Def.Nationality.Commands.Update;
internal class UpdateNationalityCommandValidator: AbstractValidator<UpdateNationalityCommand>
{
    public UpdateNationalityCommandValidator()
    {
        RuleFor(e => e.NationalityCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.NationalityNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.NationalityNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));
    }
}
