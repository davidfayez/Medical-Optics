
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ERP.DAL.Domains;

namespace Medical_Optics.Domain.Entities.Optic.Favorites;

public class FavoriteDiagnosis : AuditableEntity
{
    public int Id { get; set; }
    public string? FavoriteName { get; set; }
    public string? Description { get; set; }

}
