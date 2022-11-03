using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic.Favorites;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Medical_Optics.Infrastructure.Configurations;
public class FavoriteDiagnoseItemConfiguration : IEntityTypeConfiguration<FavoriteDiagnoseItem>
{
    public void Configure(EntityTypeBuilder<FavoriteDiagnoseItem> builder)
    {
        builder.ToTable(nameof(FavoriteDiagnoseItem));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.HasOne(s => s.FavoriteDiagnose)
               .WithMany(s => s.FavoriteDiagnoseItems)
               .HasForeignKey(s => s.FavoriteDiagnoseId)
               .OnDelete(DeleteBehavior.NoAction);

    }
}