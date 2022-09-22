using ERP.DAL.Domains;
using Medical_Optics.Domain.Interfaces;

namespace Medical_Optics.Domain.Common;

public abstract class AuditableEntity : IAuditableEntity
{
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsSystem { get; set; }                  // تم الادخال من الشاشات أم قاعدة البيانات
    public DateTime CreationDate { get; set; }         // تاريخ الادخال
    public DateTime LastModifiedDate { get; set; }    // تاريخ التعديل

    //============================================================================ a reference navigation property 
    public string? CreatedUserId { get; set; }            // اسم المستخدم
    public string? LastModifiedUserId { get; set; }  // اسم المستخدم الذى قام بالتعديل
    public string? DeletedUserId { get; set; }
    public virtual AspNetUser? CreatedUser { get; set; }
    public virtual AspNetUser? LastModifiedUser { get; set; }
    public virtual AspNetUser? DeletedUser { get; set; }
}
