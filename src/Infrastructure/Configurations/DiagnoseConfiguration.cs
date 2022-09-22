using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medical_Optics.Infrastructure.Configurations;
public class DiagnoseConfiguration : IEntityTypeConfiguration<Diagnose>
{
    public void Configure(EntityTypeBuilder<Diagnose> builder)
    {
        builder.ToTable(nameof(Diagnose));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.DiagnoseCode)
               .IsRequired()
               .HasMaxLength(30);

        builder.Property(s => s.DiagnoseNameAr)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.DiagnoseNameEn)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.Description)
               .HasMaxLength(1000);
    }
}
