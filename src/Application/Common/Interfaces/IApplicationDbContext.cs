﻿using ERP.DAL.Domains;
using ERP.DAL.Domains.Authentication;
using ERP.DAL.Domains.Def;
using Medical_Optics.Domain.Entities.Def;
using Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Common.Interfaces;
public interface IApplicationDbContext
{
    #region Identity
    DbSet<ApplicationRole> AspNetRoles { get;} 
    DbSet<AspNetUser> AspNetUsers { get;} 
    DbSet<AspNetUserDefBranch> AspNetUserDefBranches { get;} 
    DbSet<ApplicationUserRole> AspNetUserRoles { get;} 
    DbSet<AuthenticationTickets> AuthenticationTickets { get;}
    #endregion

    #region Def
    DbSet<DefBranch> DefBranches { get;} 
    DbSet<DefCity> DefCities { get;} 
    DbSet<DefCompany> DefCompanies { get;} 
    DbSet<DefCountry> DefCountries { get;} 
    DbSet<DefCurrency> DefCurrencies { get;} 
    DbSet<DefDocumentType> DefDocumentTypes { get;} 
    DbSet<DefNationality> DefNationalities { get;} 
    DbSet<DefReligion> DefReligions { get;}
    #endregion

    #region Optic
    DbSet<Complaint> Complaints { get; }
    DbSet<SubComplaint> SubComplaints { get; }
    DbSet<Diagnose> Diagnoses { get; }

    #endregion
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

}
