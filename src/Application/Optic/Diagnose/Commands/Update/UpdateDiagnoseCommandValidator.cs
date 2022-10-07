using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Optic.Complaint.Commands.Update;

namespace Medical_Optics.Application.Optic.Diagnose.Commands.Update;
public class UpdateComplaintCommandValidator : AbstractValidator<UpdateComplaintCommand>
{
    public UpdateComplaintCommandValidator()
    {
        RuleFor(e => e.ComplaintCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.ComplaintNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.ComplaintNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));
    }
}
