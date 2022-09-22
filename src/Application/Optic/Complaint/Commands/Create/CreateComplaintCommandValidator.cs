using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;

namespace Medical_Optics.Application.Optic.Complaint.Commands.Create;
public class CreateComplaintCommandValidator : AbstractValidator<CreateComplaintCommand>
{
    public CreateComplaintCommandValidator()
    {
        RuleFor(e => e.ComplaintCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat("Complaint Code"));

        RuleFor(e => e.ComplaintNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat("Arabic Name"));

        RuleFor(e => e.ComplaintNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat("English Name"));
    }
}
