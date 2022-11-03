using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Medical_Optics.Application.Common.Enums;
using Medical_Optics.Application.Common.Extensions;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;
using Resources = Medical_Optics.Application.Common.Resources;

namespace Medical_Optics.Application.Optic.CustomerData.Commands.Create;
public class CreateCustomerDataCommandValidator : AbstractValidator<CreateCustomerDataCommand>
{
    public CreateCustomerDataCommandValidator()
    {
        #region Customer Data
        RuleFor(e => e.CustomerDataVM.CustomerMRN).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.CustomerMRN))
                .MaximumLength(30) ;
               

        RuleFor(e => e.CustomerDataVM.CustomerFileNo).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.CustomerFileNo))
                .MaximumLength(30);

        RuleFor(e => e.CustomerDataVM.CustomerNameAr).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.CustomerNameAr))
                .MaximumLength(50);

        RuleFor(e => e.CustomerDataVM.CustomerNameEn).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.CustomerNameEn))
                .MaximumLength(50);
        
        RuleFor(e => e.CustomerDataVM.FamilyName).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.FamilyName))
                .MaximumLength(50);

        RuleFor(e => e.CustomerDataVM.FatherName).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.FatherName))
                .MaximumLength(50);

        RuleFor(e => e.CustomerDataVM.BirthDate).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.BirthDate));
        
        RuleFor(e => e.CustomerDataVM.IDNumber).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.IDNumber))
                .MaximumLength(50);

        RuleFor(e => e.CustomerDataVM.IDType).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.IDType));

        RuleFor(e => e.CustomerDataVM.Mobile).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Mobile))
                .MaximumLength(50);

        RuleFor(e => e.CustomerDataVM.Email).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Global.Email))
                .MaximumLength(50);

        RuleFor(e => e.CustomerDataVM.Description).MaximumLength(500)
                .WithMessage(ErrorMessages.MaxLengthNotValid);

        #endregion




        #region MEdical Insurance

        RuleFor(e => e.MedicalInsuranceVM.InsuranceCompanyName).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.InsuranceCompanyName))
                .When(s => s.CustomerDataVM.PayType == (int)PayType.Credit);

        RuleFor(e => e.MedicalInsuranceVM.CardNumber).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.CardNumber))
                .When(s => s.CustomerDataVM.PayType == (int)PayType.Credit);

        RuleFor(e => e.MedicalInsuranceVM.DateExpiry).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.DateExpiry))
                .When(s => s.CustomerDataVM.PayType == (int)PayType.Credit);

        RuleFor(e => e.MedicalInsuranceVM.DateIssued).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.DateIssued))
                .When(s => s.CustomerDataVM.PayType == (int)PayType.Credit);

        RuleFor(e => e.MedicalInsuranceVM.ClassType).NotNull()
                .WithMessage(ErrorMessages.RequiredMessage.StringFormat(Resources.Optic.ClassType))
                .When(s => s.CustomerDataVM.PayType == (int)PayType.Credit);

        #endregion

        #region National Address

        #endregion
    }
}
