using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic.Favorites;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Medical_Optics.Infrastructure.Configurations;
public class FavoriteExaminationConfiguration : IEntityTypeConfiguration<FavoriteExamination>
{
    public void Configure(EntityTypeBuilder<FavoriteExamination> builder)
    {
        builder.ToTable(nameof(FavoriteExamination));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.FavoriteName)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.Description)
              .IsRequired()
              .HasMaxLength(500);
    }
}
