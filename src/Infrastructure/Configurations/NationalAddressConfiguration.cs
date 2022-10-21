using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medical_Optics.Infrastructure.Configurations;
public class NationalAddressConfiguration : IEntityTypeConfiguration<NationalAddress>
{
    public void Configure(EntityTypeBuilder<NationalAddress> builder)
    {
        builder.ToTable(nameof(NationalAddress));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.UnifiedNationalNumber)
           .HasMaxLength(30);

        builder.Property(s => s.BuildingNumber)
           .HasMaxLength(30);

        builder.Property(s => s.StreetName)
           .HasMaxLength(100);

        builder.Property(s => s.DistrictName)
          .HasMaxLength(50);

        builder.Property(s => s.PostalCode)
          .HasMaxLength(30);

        builder.Property(s => s.ExtraNumber)
          .HasMaxLength(50);

        builder.Property(s => s.UnitNumber)
          .HasMaxLength(10);

        builder.HasOne(s => s.Client)
        .WithOne(s => s.NationalAddress)
        .HasForeignKey<NationalAddress>(b => b.ClientId)
        .OnDelete(DeleteBehavior.NoAction);
    }
}
