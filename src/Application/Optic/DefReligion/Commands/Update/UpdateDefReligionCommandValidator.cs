using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Optic.DefReligion.Commands.Update;
public class UpdateDefReligionCommandValidator:AbstractValidator<UpdateDefReligionCommand>
{
    public UpdateDefReligionCommandValidator()
    {
        RuleFor(r => r.ReligionCode).NotNull()
            .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.ReligionNameAr).NotNull()
                    .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.ReligionNameEn).NotNull()
                    .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));
    }
}
