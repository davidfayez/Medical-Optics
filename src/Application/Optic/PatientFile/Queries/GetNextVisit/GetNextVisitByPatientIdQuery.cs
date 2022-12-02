using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Optic.PatientFile.Queries.GetById;

namespace Medical_Optics.Application.Optic.PatientFile.Queries.GetNextVisit;
public class GetNextVisitByPatientIdQuery : IRequest<int>
{
    public int ClientId { get; set; }
}

public class GetNextVisitByPatientIdQueryHandler : IRequestHandler<GetNextVisitByPatientIdQuery, int>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetNextVisitByPatientIdQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<int> Handle(GetNextVisitByPatientIdQuery request, CancellationToken cancellationToken)
    {
        var PatientMedicalFile = _applicationDbContext.PatientMedicalFiles
                                                .Include(s => s.PatientComplaints)
                                                .FirstOrDefault(s =>s.ClientId == request.ClientId && !s.IsDeleted);
       
        if(PatientMedicalFile?.PatientComplaints.Count > 0)
            return Task.FromResult(PatientMedicalFile.PatientComplaints
                                                     .Where(s=>!s.IsDeleted)
                                                     .Max(s=>s.VisitNo) + 1);
        else
            return Task.FromResult(1);


    }


}
