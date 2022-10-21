using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medical_Optics.Infrastructure.Configurations;
public class CustomerDataConfiguration : IEntityTypeConfiguration<CustomerData>
{
    public void Configure(EntityTypeBuilder<CustomerData> builder)
    {
        builder.ToTable(nameof(CustomerData));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.CustomerMRN)
               .IsRequired()
               .HasMaxLength(30);

        builder.Property(s => s.CustomerFileNo)
               .IsRequired()
               .HasMaxLength(30);

        builder.Property(s => s.CustomerNameAr)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(s => s.CustomerNameEn)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(s => s.FamilyName)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(s => s.FatherName)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(s => s.BirthDate)
               .IsRequired();

        builder.Property(s => s.Age)
               .IsRequired();

        builder.Property(s => s.Gender)
               .IsRequired();

        builder.Property(s => s.PayType)
              .IsRequired();

        builder.Property(s => s.IDType)
              .IsRequired();

        builder.Property(s => s.IDNumber)
              .IsRequired();

        builder.Property(s => s.Mobile)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(s => s.Email)
              .IsRequired()
              .HasMaxLength(50);

        builder.Property(s => s.ImageUrl)
           .HasMaxLength(850);

        builder.Property(s => s.Description)
          .HasMaxLength(500);

        builder.HasOne(s => s.Nationality)
          .WithMany(s => s.CustomersData)
          .HasForeignKey(s => s.NationalityId)
          .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(s => s.Religion)
        .WithMany(s => s.CustomersData)
        .HasForeignKey(s => s.ReligionId)
        .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(s => s.SocialStatus)
        .WithMany(s => s.CustomersData)
        .HasForeignKey(s => s.SocialStatusId)
        .OnDelete(DeleteBehavior.NoAction);

    }
}
