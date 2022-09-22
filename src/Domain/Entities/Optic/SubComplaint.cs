

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Medical_Optics.Domain.Entities.Optic;

public class SubComplaint : AuditableEntity
{
    public int Id { get; set; }
    public int ComplaintId { get; set; }    // الشكوى الرئيسية
    public string SubComplaintCode { get; set; }
    public string SubComplaintNameAr { get; set; }
    public string SubComplaintNameEn { get; set; }
    public string SubComplaintPhotoPath { get; set; } // صورة الشكوى 
    public string Description { get; set; }
    public virtual Complaint? Complaint { get; set; }
}
