using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic.Favorites;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Medical_Optics.Infrastructure.Configurations;
public class FavoriteDiagnosisConfiguration : IEntityTypeConfiguration<FavoriteDiagnosis>
{
    public void Configure(EntityTypeBuilder<FavoriteDiagnosis> builder)
    {
        builder.ToTable(nameof(FavoriteDiagnosis));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.FavoriteName)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.Description)
              .IsRequired()
              .HasMaxLength(500);
    }
}


