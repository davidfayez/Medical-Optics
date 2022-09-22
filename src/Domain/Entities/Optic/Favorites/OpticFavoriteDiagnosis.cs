
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ERP.DAL.Domains;

namespace Medical_Optics.Domain.Entities.Optic.Favorites;

[Table("OpticFavoriteDiagnosis")] // اضافة التشخيص الى المفضلة
public class OpticFavoriteDiagnosis : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information

    [Required, StringLength(300)]
    public string? FavoriteName { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    //============================================================================ Additional Properties By Using Fluent API 
    public virtual AspNetUser? User { get; set; }

    public virtual AspNetUser? LastModifiedUserId { get; set; }

    public virtual AspNetUser? DeletedUserId { get; set; }
}
