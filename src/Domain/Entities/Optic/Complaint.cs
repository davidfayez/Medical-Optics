
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Medical_Optics.Domain.Entities.Optic;

public class Complaint : AuditableEntity
{
    public int Id { get; set; }
    public string ComplaintCode { get; set; }
    public string ComplaintNameAr { get; set; }
    public string ComplaintNameEn { get; set; }
    public string ComplaintImagePath { get; set; } // صورة الشكوى 
    public string Description { get; set; }
    public virtual IList<SubComplaint> SubComplaints { get; set; }
}
