
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

[Table("OpticMedicalFileExamination")] // اضافة الفحص العميل الى الملف الطبى
public class OpticMedicalFileExamination : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information
    public int ClientId { get; set; }            // رقم العميل

    public int VisitNo { get; set; }             // رقم الزيارة

    //============================================================================  مقاسات النظاره
    //================================================================== Right Eye  
    public string RDistSPH { get; set; }
    public string RDistCYL { get; set; }
    public string RDistAxis { get; set; }
    public string RNearSPH { get; set; }
    public string RNearCYL { get; set; }
    public string RNearAxis { get; set; }
    public string RClSPH { get; set; }
    public string RClCYL { get; set; }
    public string RClAxis { get; set; }
    //================================================================== Left Eye
    public string LDistSPH { get; set; }
    public string LDistCYL { get; set; }
    public string LDistAxis { get; set; }
    public string LNearSPH { get; set; }
    public string LNearCYL { get; set; }
    public string LNearAxis { get; set; }
    public string LClSPH { get; set; }
    public string LClCYL { get; set; }
    public string LClAxis { get; set; }

    //============================================================================ 
    public string Type { get; set; }
    public string Lense { get; set; }

    [Required, StringLength(1000)]
    public string LocalExamination { get; set; }         // المكتوب في Textarea

    public virtual OpticCustomerData Client { get; set; }
}
