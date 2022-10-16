using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Def.Branch.Commands.Create;
public class CreateBranchCommandValidator : AbstractValidator<CreateBranchCommand>
{
    public CreateBranchCommandValidator()
    {
        RuleFor(e => e.BranchCode).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Code));

        RuleFor(e => e.BranchNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.BranchNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));

        RuleFor(e => e.BranchAddress).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Address));
    }
}
