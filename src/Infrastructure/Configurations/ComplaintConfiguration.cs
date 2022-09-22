using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medical_Optics.Infrastructure.Configurations;
public class ComplaintConfiguration : IEntityTypeConfiguration<Complaint>
{
    public void Configure(EntityTypeBuilder<Complaint> builder)
    {
        builder.ToTable(nameof(Complaint));

        builder.Property(s=>s.Id).UseIdentityColumn();

        builder.Property(s => s.ComplaintCode)
               .IsRequired()
               .HasMaxLength(30);

        builder.Property(s => s.ComplaintNameAr)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.ComplaintNameEn)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.Description)
               .HasMaxLength(1000);
    }
}
