using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Domain.Interfaces;
public interface IAuditableEntity
{
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsSystem { get; set; }                  
    public DateTime CreationDate { get; set; }        
    public DateTime LastModifiedDate { get; set; }   

    public string? CreatedUserId { get; set; }           
    public string? LastModifiedUserId { get; set; }  
    public string? DeletedUserId { get; set; }
}
