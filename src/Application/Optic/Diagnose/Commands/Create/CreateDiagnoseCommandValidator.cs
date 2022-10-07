using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Optic.Diagnose.Commands.Create;
public class CreateDiagnoseCommandValidator:AbstractValidator<CreateDiagnoseCommand>
{
    public CreateDiagnoseCommandValidator()
    {
        RuleFor(e => e.DiagnoseCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.DiagnoseNameEn).NotNull()
            .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.DiagnoseNameAr).NotNull()
            .WithErrorCode(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));  
    }
}
