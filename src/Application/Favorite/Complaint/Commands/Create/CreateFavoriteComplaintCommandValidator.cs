using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;

namespace Medical_Optics.Application.Favorite.Complaint.Commands.Create;
public class CreateFavoriteComplaintCommandValidator : AbstractValidator<CreateFavoriteComplaintCommand>
{
    public CreateFavoriteComplaintCommandValidator()
    {
        RuleFor(e => e.FavoriteName).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Name));

        RuleFor(e => e.SelectedIds).NotNull()
                .WithMessage("Please choose at least one Complaint");
        
    }
}

