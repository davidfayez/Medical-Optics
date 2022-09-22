
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

public class Diagnose : AuditableEntity
{
    public int Id { get; set; }
    public string DiagnoseCode { get; set; }
    public string DiagnoseNameAr { get; set; }
    public string DiagnoseNameEn { get; set; }
    public string Description { get; set; }
    
}
