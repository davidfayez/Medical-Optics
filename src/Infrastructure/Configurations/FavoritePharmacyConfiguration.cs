using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic;
using Medical_Optics.Domain.Entities.Optic.Favorites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medical_Optics.Infrastructure.Configurations;
public class FavoritePharmacyConfiguration : IEntityTypeConfiguration<FavoritePharmacy>
{
    public void Configure(EntityTypeBuilder<FavoritePharmacy> builder)
    {
        builder.ToTable(nameof(FavoritePharmacy));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.FavoriteName)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.Description)
              .IsRequired()
              .HasMaxLength(500);
    }
}
