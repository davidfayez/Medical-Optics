
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ERP.DAL.Domains.Def
{
	[Table("DefCompany")]
	public class DefCompany : AuditableEntity
    {
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		
		[Required]
		[StringLength(100)]
		public string CompanyNameAr { get; set; }
		
		[Required]
		[StringLength(100)]
		public string CompanyNameEn { get; set; }
		
		[Required]
		[StringLength(100)]
		public string CompanyAddress { get; set; }
		
		[StringLength(50)]
		public string Phone1 { get; set; }
		
		[StringLength(50)]
		public string Phone2 { get; set; }
		
		[StringLength(50)]
		public string Phone3 { get; set; }
		
		[StringLength(100)]
		public string Email { get; set; }
		
		[StringLength(50)]
		public string Fax { get; set; }
		
		[StringLength(50)]
		public string PostCode { get; set; }

		[StringLength(100)]
		public string Website { get; set; }
		
		[StringLength(100)]
		public string LogoUrl { get; set; }
		
		[Required]
		public DateTime FinancialYearStart { get; set; }
		
		[Required]
		public DateTime FinancialYearEnd { get; set; }
		
		[StringLength(1000)]
		public string Notes { get; set; }
		[StringLength(50)]
		public string CommercialRegister { get; set; }
		[StringLength(1000)]
		
		public string Location { get; set; }
		[StringLength(50)]
		public string TaxCard { get; set; }

	}
}

