﻿using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Optic.SubCompalint.Commands.Create;
public class CreateSubComplaintCommandValidator:AbstractValidator<CreateSubComplaintCommand>
{
    public CreateSubComplaintCommandValidator()
    {
        RuleFor(s => s.SubComplaintCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.SubComplaintNameAr).NotNull()
               .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.SubComplaintNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));
    }
}
