using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic.Favorites;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Medical_Optics.Infrastructure.Configurations;
public class FavoriteComplaintItemConfiguration : IEntityTypeConfiguration<FavoriteComplaintItem>
{
    public void Configure(EntityTypeBuilder<FavoriteComplaintItem> builder)
    {
        builder.ToTable(nameof(FavoriteComplaintItem));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.HasOne(s => s.FavoriteComplaint)
               .WithMany(s => s.FavoriteComplaintItems)
               .HasForeignKey(s => s.FavoriteComplaintId)
               .OnDelete(DeleteBehavior.NoAction);

    }
}