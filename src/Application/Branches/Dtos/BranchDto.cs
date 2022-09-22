using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.DAL.Domains.Def;
using Medical_Optics.Application.Common.Mappings;

namespace Medical_Optics.Application.Branches.Dtos;
public class BranchDto : IMapFrom<DefBranch>
{
    public int Id { get; set; }
    public string BranchCode { get; set; }
    public string BranchNameAr { get; set; }
    public string BranchNameEn { get; set; }
}
