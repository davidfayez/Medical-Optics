using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.DAL.Domains;
using ERP.DAL.Domains.Authentication;
using ERP.DAL.Domains.Def;
using Microsoft.EntityFrameworkCore;

namespace Medical_Optics.Infrastructure.Persistence;
public static class ModelBuilderExtensions
{
    public static void Seed(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AspNetUser>().HasData(
           new AspNetUser
           {
               Id = "5e46158f-44e1-4e78-8101-8a4617d5daba",
               UserName = "Developer",
               NormalizedUserName = "DEVELOPER",
               Email = null,
               NormalizedEmail = null,
               EmailConfirmed = false,
               PasswordHash = "AQAAAAEAACcQAAAAEHaohoeqzEiX/FGJWJ4i64MQ6gJjBAQ1ywiJKpFTlBacjNpMMDJCYRjyZcDfdeS57Q==",
               SecurityStamp = "THFLQTJYXMDTPEPOVONPR6R2WZBOCJMA",
               ConcurrencyStamp = "b795837e-ee8a-41ac-aed4-3fea2f771308",
               PhoneNumber = null,
               PhoneNumberConfirmed = false,
               TwoFactorEnabled = false,
               LockoutEnd = null,
               LockoutEnabled = true,
               AccessFailedCount = 0,
               FullName = "ERP Developer",
               Image = "profile-icon.jpg",
               SurName = "Developer",
               Password = "123456",
               IsDeveloper = true,
               CreationDate = DateTime.Now,
               IsDeleted = false,
               LastModifiedDate = DateTime.Now
           }
          );

        #region ApplicationRole

        modelBuilder.Entity<ApplicationRole>().HasData(
           new ApplicationRole {
               Id = "63998b7d-6724-49a6-8488-0798f13726d5",
               NameAr = "مبرمج",
               Name = "Developer",
               NormalizedName = "Developer".ToUpper() }
           );

        #endregion ApplicationRole

        modelBuilder.Entity<DefCompany>().HasData(
                new DefCompany
                {
                    Id = 1,
                    CompanyNameAr = "الشركة",
                    CompanyNameEn = "Company",
                    CompanyAddress = "المملكة العربية السعودية",
                    CreatedUserId = "5e46158f-44e1-4e78-8101-8a4617d5daba",
                    CommercialRegister = "123456",
                    Email = "test@example.com",
                    Fax = "123456",
                    Phone1 = "01204789654",
                    Phone2 = "01204789654",
                    Phone3 = "01204789654",
                    LogoUrl = "//test.jpg",
                    Notes = "No",
                    PostCode = "1234",
                    TaxCard = "1234",
                    Website = "www.Ansari.Com",
                    Location = "Riadh",
                    LastModifiedDate = DateTime.Now,
                    FinancialYearStart = new DateTime(DateTime.Now.Year, 01, 01),
                    FinancialYearEnd = new DateTime(DateTime.Now.Year, 12, 31),
                    CreationDate = DateTime.Now
                }
                );
        modelBuilder.Entity<DefBranch>().HasData(
            new DefBranch
            {
                Id = 1,
                BranchCode = "1",
                BranchNameAr = "الفرع الرئيسي",
                BranchNameEn = "Main Branch",
                BranchAddress = "عنوان الفرع",
                DefCompanyId = 1,
                CreatedUserId = "5e46158f-44e1-4e78-8101-8a4617d5daba",
                CreationDate = DateTime.Now,
                LastModifiedDate = DateTime.Now,
                CommercialRegister="123456",
                Email="test@example.com",
                Fax="123456",
                Fax2="123456",
                Fax3="123456",
                Phone1="01204789654",
                Phone2="01204789654",
                Phone3="01204789654",
                LogoUrl="//test.jpg",
                Notes="No",
                PostCode="1234",
                TaxCard="1234",
                Website="www.Ansari.Com",
                IsActive = true,
                IsDeleted = false
            }
            );
        modelBuilder.Entity<AspNetUserDefBranch>().HasData(
            new AspNetUserDefBranch { Id = 1, DefBranchId = 1, AspNetUserId = "5e46158f-44e1-4e78-8101-8a4617d5daba", CreatedUserId = "5e46158f-44e1-4e78-8101-8a4617d5daba", CreationDate = DateTime.Now, LastModifiedDate = DateTime.Now, IsActive = true, IsDeleted = false });

        modelBuilder.Entity<ApplicationUserRole>().HasData(
           new ApplicationUserRole {
               UserId = "5e46158f-44e1-4e78-8101-8a4617d5daba",
               RoleId = "63998b7d-6724-49a6-8488-0798f13726d5",
               DefBranchId = 1 }

           );
        modelBuilder.Entity<DefCurrency>().HasData(
          new DefCurrency {
              Id = 1,
              Code = "1",
              CurrencyNameAr = "العملة الافتراضية",
              CurrencyNameEn = "Default Currency",
              AbbreviationAr = "",
              AbbreviationEn = "",
              IsPimary = true,
              DefaultFactor = 1,
              CreatedUserId = "5e46158f-44e1-4e78-8101-8a4617d5daba",
              CreationDate = DateTime.Now,
              LastModifiedDate = DateTime.Now,
              IsActive = true,
              IsDeleted = false }
        );

        modelBuilder.Entity<DefCountry>().HasData(

               new DefCountry {
                   Id = 1,
                   CountryCode = "1",
                   CountryNameAr = "السعودية",
                   CountryNameEn = "KSA",
                   CapitalNameAr = "سعودي",
                   CapitalNameEn = "Saudian",
                   CreatedUserId = "5e46158f-44e1-4e78-8101-8a4617d5daba",
                   CreationDate = DateTime.Now,
                   LastModifiedDate = DateTime.Now,
                   Description="NO",
                   IsActive = true,
                   IsDeleted = false
               }
                  );
        modelBuilder.Entity<DefReligion>().HasData(
          new DefReligion { Id = 1,
              ReligionNameAr = "مسلم",
              ReligionNameEn = "Mulslim",
              ReligionCode = "1",
              Description = "",
              CreatedUserId = "5e46158f-44e1-4e78-8101-8a4617d5daba",
              CreationDate = DateTime.Now,
              LastModifiedDate = DateTime.Now,
              IsActive = true,
              IsDeleted = false }
             );
    }

}
