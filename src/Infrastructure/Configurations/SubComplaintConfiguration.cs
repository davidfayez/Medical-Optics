using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Domain.Entities.Optic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medical_Optics.Infrastructure.Configurations;
public class SubComplaintConfiguration : IEntityTypeConfiguration<SubComplaint>
{
    public void Configure(EntityTypeBuilder<SubComplaint> builder)
    {
        builder.ToTable(nameof(SubComplaint));

        builder.Property(s => s.Id).UseIdentityColumn();

        builder.Property(s => s.SubComplaintCode)
               .IsRequired()
               .HasMaxLength(30);

        builder.Property(s => s.SubComplaintNameAr)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.SubComplaintNameEn)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(s => s.Description)
               .HasMaxLength(1000);

        builder.HasOne(s => s.Complaint)
            .WithMany(s => s.SubComplaints)
            .HasForeignKey(s => s.ComplaintId)
            .OnDelete(DeleteBehavior.NoAction);

    }
}
