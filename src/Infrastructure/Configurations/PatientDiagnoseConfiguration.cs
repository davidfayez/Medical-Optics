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
public class PatientDiagnoseConfiguration : IEntityTypeConfiguration<PatientDiagnose>
{
    public void Configure(EntityTypeBuilder<PatientDiagnose> builder)
    {
        builder.ToTable(nameof(PatientDiagnose));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.VisitNo)
               .IsRequired();

        builder.HasOne(s => s.PatientMedicalFile)
       .WithMany(s => s.PatientDiagnosis)
       .HasForeignKey(s => s.PatientMedicalFileId)
       .OnDelete(DeleteBehavior.NoAction);
    }
}
