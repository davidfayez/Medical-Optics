using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Domain.Entities.Optic.Favorites;
public class FavoriteDiagnoseItem : AuditableEntity
{
    public int Id { get; set; }
    public int DiagnoseId { get; set; }
    public int FavoriteDiagnoseId { get; set; }
    public Diagnose Diagnose { get; set; }
    public FavoriteDiagnose FavoriteDiagnose { get; set; }

}
