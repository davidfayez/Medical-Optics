using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medical_Optics.Infrastructure.Configurations;
public class MedicalInsuranceConfiguration : IEntityTypeConfiguration<MedicalInsurance>
{
    public void Configure(EntityTypeBuilder<MedicalInsurance> builder)
    {
        builder.ToTable(nameof(MedicalInsurance));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.InsuranceCompanyName)
           .HasMaxLength(50);

        builder.Property(s => s.CardNumber)
          .HasMaxLength(50);

        builder.Property(s => s.ClassType)
          .HasMaxLength(50);

        builder.Property(s => s.Description)
              .HasMaxLength(500);

        builder.HasOne(s => s.Client)
       .WithOne(s => s.MedicalInsurance)
       .HasForeignKey<MedicalInsurance>(b => b.ClientId)
       .OnDelete(DeleteBehavior.NoAction);
    }
}
