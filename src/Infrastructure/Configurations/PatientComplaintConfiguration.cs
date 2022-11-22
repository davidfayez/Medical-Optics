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
public class PatientComplaintConfiguration : IEntityTypeConfiguration<PatientComplaint>
{
    public void Configure(EntityTypeBuilder<PatientComplaint> builder)
    {
        builder.ToTable(nameof(PatientComplaint));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.ComplaintName)
               .IsRequired()
               .HasMaxLength(400);

        builder.HasOne(s => s.PatientMedicalFile)
       .WithMany(s => s.PatientComplaints)
       .HasForeignKey(s => s.PatientMedicalFileId)
       .OnDelete(DeleteBehavior.NoAction);
    }
}
