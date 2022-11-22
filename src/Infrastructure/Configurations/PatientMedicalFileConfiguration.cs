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
public class PatientMedicalFileConfiguration : IEntityTypeConfiguration<PatientMedicalFile>
{
    public void Configure(EntityTypeBuilder<PatientMedicalFile> builder)
    {
        builder.ToTable(nameof(PatientMedicalFile));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.HasOne(s => s.Client)
       .WithOne(s => s.PatientMedicalFile)
       .HasForeignKey<PatientMedicalFile>(b => b.ClientId)
       .OnDelete(DeleteBehavior.NoAction);


    }
}
