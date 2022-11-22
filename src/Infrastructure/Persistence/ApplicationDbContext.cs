using System;
using System.Collections.Generic;
using Medical_Optics.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Medical_Optics.Domain.Interfaces;
using ERP.DAL.Domains;
using ERP.DAL.Domains.Authentication;
using Microsoft.AspNetCore.Identity;
using ERP.DAL.Domains.Def;
using Medical_Optics.Domain.Entities.Optic;
using System.Reflection;
using Medical_Optics.Domain.Entities.Def;
using Medical_Optics.Domain.Entities.Identity;
using Medical_Optics.Domain.Entities.HR;
using Medical_Optics.Domain.Entities.Optic.Favorites;

namespace Medical_Optics.Infrastructure.Persistence;

public partial class ApplicationDbContext : IdentityDbContext<AspNetUser, ApplicationRole, string, IdentityUserClaim<string>,
                                                  ApplicationUserRole, IdentityUserLogin<string>,
                                                  IdentityRoleClaim<string>, IdentityUserToken<string>>, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTime _dateTime;

    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService,
            IDomainEventService domainEventService,
            IDateTime dateTime)
        : base(options)
    {
        _currentUserService = currentUserService;
        _dateTime = dateTime;
    }

    #region Identity
    public virtual DbSet<ApplicationRole> AspNetRoles => Set<ApplicationRole>();
    public virtual DbSet<AspNetUser> AspNetUsers => Set<AspNetUser>();
    public virtual DbSet<AspNetUserDefBranch> AspNetUserDefBranches => Set<AspNetUserDefBranch>();
    public virtual DbSet<ApplicationUserRole> AspNetUserRoles => Set<ApplicationUserRole>();
    public virtual DbSet<AuthenticationTickets> AuthenticationTickets => Set<AuthenticationTickets>();
    #endregion

    #region Def
    public virtual DbSet<DefBranch> DefBranches => Set<DefBranch>();
    public virtual DbSet<DefCity> DefCities => Set<DefCity>();
    public virtual DbSet<DefCompany> DefCompanies => Set<DefCompany>();
    public virtual DbSet<DefCountry> DefCountries => Set<DefCountry>();
    public virtual DbSet<DefCurrency> DefCurrencies => Set<DefCurrency>();
    public virtual DbSet<DefDocumentType> DefDocumentTypes => Set<DefDocumentType>();
    public virtual DbSet<DefNationality> DefNationalities => Set<DefNationality>();
    public virtual DbSet<DefReligion> DefReligions => Set<DefReligion>();
    #endregion

    #region HR
    public virtual DbSet<HrSocialStatus> HrSocialStatus => Set<HrSocialStatus>();
    #endregion

    #region Optic
    public virtual DbSet<Complaint> Complaints => Set<Complaint>();
    public virtual DbSet<SubComplaint> SubComplaints => Set<SubComplaint>();
    public virtual DbSet<Diagnose> Diagnoses => Set<Diagnose>();
    public virtual DbSet<CustomerData> CustomersData => Set<CustomerData>();
    public virtual DbSet<MedicalInsurance> MedicalInsurances => Set<MedicalInsurance>();
    public virtual DbSet<NationalAddress> NationalAddresses => Set<NationalAddress>();
    public virtual DbSet<PatientMedicalFile> PatientMedicalFiles => Set<PatientMedicalFile>();
    public virtual DbSet<PatientComplaint> PatientComplaints => Set<PatientComplaint>();

    #endregion

    #region Favorite
    public virtual DbSet<FavoriteComplaint> FavoriteComplaints => Set<FavoriteComplaint>();
    public virtual DbSet<FavoriteComplaintItem> FavoriteComplaintItems => Set<FavoriteComplaintItem>();
    public virtual DbSet<FavoriteDiagnose> FavoriteDiagnoses => Set<FavoriteDiagnose>();
    public virtual DbSet<FavoriteDiagnoseItem> FavoriteDiagnoseItems => Set<FavoriteDiagnoseItem>();
    public virtual DbSet<FavoriteExamination> FavoriteExaminations => Set<FavoriteExamination>();
    public virtual DbSet<FavoritePharmacy> FavoritePharmacies => Set<FavoritePharmacy>();
    #endregion


    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        foreach (var entry in ChangeTracker.Entries<IAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedUserId = _currentUserService.UserId;
                    entry.Entity.CreationDate = _dateTime.Now;
                    break;

                case EntityState.Modified:
                    entry.Entity.LastModifiedUserId = _currentUserService.UserId;
                    entry.Entity.LastModifiedDate = _dateTime.Now;
                    break;

                case EntityState.Deleted:
                    entry.Entity.DeletedUserId = _currentUserService.UserId;
                    entry.Entity.LastModifiedDate = _dateTime.Now;
                    break;
            }
        }

        var result = await base.SaveChangesAsync(cancellationToken);

        return result;
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
        modelBuilder.Seed();
    }
}
