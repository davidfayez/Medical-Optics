
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic.Favorites;

[Table("OpticFavoriteExamination")]
public class OpticFavoriteExamination : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information

    [Required, StringLength(300)]
    public string FavoriteName { get; set; }

    [StringLength(500)]
    public string Description { get; set; }

}
