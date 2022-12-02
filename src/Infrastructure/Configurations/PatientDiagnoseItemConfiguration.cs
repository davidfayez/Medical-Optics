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
public class PatientDiagnoseItemConfiguration : IEntityTypeConfiguration<PatientDiagnoseItem>
{
    public void Configure(EntityTypeBuilder<PatientDiagnoseItem> builder)
    {
        builder.ToTable(nameof(PatientDiagnoseItem));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.HasOne(s => s.PatientDiagnose)
               .WithMany(s => s.PatientDiagnoseItems)
               .HasForeignKey(s => s.PatientDiagnoseId)
               .OnDelete(DeleteBehavior.NoAction);
    }
}
