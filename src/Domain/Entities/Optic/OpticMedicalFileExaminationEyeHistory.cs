
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medical_Optics.Domain.Entities.Optic;

[Table("OpticMedicalFileExaminationEyeHistory")] // اضافة الفحص المرضى للعين العميل الى الملف الطبى
public class OpticMedicalFileExaminationEyeHistory : AuditableEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    //============================================================================ General Information
    public int ClientId { get; set; }            // رقم العميل

    public int VisitNo { get; set; }             // رقم الزيارة

    //========================================================= another Table MultiCheck (Eye History) To Save: Id + Value + Comment
    //public int IdEyeHistory { get; set; }

    [StringLength(100)]
    public string NameEyeHistory { get; set; }

    [StringLength(200)]
    public string NameEyeHistoryComment { get; set; }

    [StringLength(500)]
    public string EyeHistoryOther { get; set; }
    public virtual CustomerData Client { get; set; }
}
