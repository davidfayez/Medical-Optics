using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetById;
using Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.PatientFile.Queries.GetPatientComplaints;
public class GetPatientComplaintsQuery : IRequest<List<PatientComplaintVM>>
{
    public int ClientId { get; set; }
}

public class GetPatientComplaintsQueryHandler : IRequestHandler<GetPatientComplaintsQuery, List<PatientComplaintVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetPatientComplaintsQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<PatientComplaintVM>> Handle(GetPatientComplaintsQuery request, CancellationToken cancellationToken)
    {
        var PatientMedicalFile = _applicationDbContext.PatientMedicalFiles
                                                .Include(s => s.PatientComplaints)
                                                .FirstOrDefault(s => !s.IsDeleted && s.ClientId == request.ClientId);
        
        var PatientComplaints = PatientMedicalFile.PatientComplaints.Where(s => !s.IsDeleted).ToList();

        var PatientComplaintsVM = _mapper.Map<List<PatientComplaintVM>>(PatientComplaints);

        if (PatientMedicalFile != null)
        {

            return Task.FromResult(PatientComplaintsVM);
        }
        else
            return Task.FromResult(new List<PatientComplaintVM>());

    }


}

