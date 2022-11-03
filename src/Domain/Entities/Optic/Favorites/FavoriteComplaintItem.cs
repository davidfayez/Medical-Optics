using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Domain.Entities.Optic.Favorites;
public class FavoriteComplaintItem : AuditableEntity
{
    public int Id { get; set; }
    public int ComplaintId { get; set; }
    public int FavoriteComplaintId { get; set; }
    public Complaint Complaint { get; set; }
    public FavoriteComplaint FavoriteComplaint { get; set; }

}
