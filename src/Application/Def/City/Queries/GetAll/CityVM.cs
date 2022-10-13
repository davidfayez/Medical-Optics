using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Application.Def.City.Queries.GetAll;
public class CityVM
{
    public int Id { get; set; }
    public string CityCode { get; set; }
    public string CityNameAr { get; set; }
    public string CityNameEn { get; set; }
    public string GovernorateNameAr { get; set; }
    public string GovernorateNameEn { get; set; }
    public int DefCountryId { get; set; }
    public string Description { get; set; }
}
