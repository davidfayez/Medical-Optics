using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Def.Company.Commands.Create;

namespace Medical_Optics.Application.Def.Company.Commands.Update;
public class UpdateCompanyCommandValidtor : AbstractValidator<UpdateCompanyCommand>
{
    public UpdateCompanyCommandValidtor()
    {
        RuleFor(e => e.CompanyAddress).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Address));

        RuleFor(e => e.CompanyNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameAr));

        RuleFor(e => e.CompanyNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.NameEn));

        RuleFor(e => e.FinancialYearStart).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.FinancialYearStart));

        RuleFor(e => e.FinancialYearEnd).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.FinancialYearEnd));
    }
}
