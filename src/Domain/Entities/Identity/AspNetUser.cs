using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ERP.DAL.Domains
{
    [Table("AspNetUsers")]
    public class AspNetUser : IdentityUser
    {
        [StringLength(100)]
        public string FullName { get; set; }
        [StringLength(100)]
        public string Image { get; set; }
        [StringLength(100)]
        public string SurName { get; set; }
        [StringLength(100)]
        public string Password { get; set; }
        [DefaultValue("false")]
        public bool IsDeveloper { get; set; }
        [DefaultValue("false")]
        public bool IsDeleted { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;   // تاريخ الادخال
        public DateTime LastModifiedDate { get; set; } = DateTime.Now;
    }
}
