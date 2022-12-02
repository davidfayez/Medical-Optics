using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientComplaints;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientDiagnosis;
using Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientDiagnoseItems;
public class GetPatientDiagnoseItemsQuery : IRequest<List<PatientDiagnoseItemVM>>
{
    public int ClientId { get; set; }
}

public class GetPatientDiagnoseItemsQueryHandler : IRequestHandler<GetPatientDiagnoseItemsQuery, List<PatientDiagnoseItemVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetPatientDiagnoseItemsQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<PatientDiagnoseItemVM>> Handle(GetPatientDiagnoseItemsQuery request, CancellationToken cancellationToken)
    {
        var PatientMedicalFile = _applicationDbContext.PatientMedicalFiles
                                                .Include(s => s.PatientDiagnosis)
                                                .FirstOrDefault(s => !s.IsDeleted && s.ClientId == request.ClientId);

        var PatientComplaints = PatientMedicalFile?.PatientDiagnosis.Where(s => !s.IsDeleted).ToList();

        var PatientComplaintsVM = _mapper.Map<List<PatientDiagnoseItemVM>>(PatientComplaints);

        if (PatientMedicalFile != null)
        {

            return Task.FromResult(PatientComplaintsVM);
        }
        else
            return Task.FromResult(new List<PatientDiagnoseItemVM>());

    }


}


