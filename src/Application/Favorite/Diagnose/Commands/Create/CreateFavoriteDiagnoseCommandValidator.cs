using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Favorite.Diagnose.Commands.Create;
public class CreateFavoriteDiagnoseCommandValidator : AbstractValidator<CreateFavoriteDiagnoseCommand>
{
    public CreateFavoriteDiagnoseCommandValidator()
    {
        RuleFor(e => e.FavoriteName).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Name));

        RuleFor(e => e.SelectedIds).NotNull()
                .WithMessage("Please choose at least one Diagnose");

    }
}