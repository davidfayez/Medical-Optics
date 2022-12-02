using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Application.Optic.Diagnose.Queries.GetAll;
public class GetAllDiagnoseQuery : IRequest<List<DiagnoseVM>>
{
    public List<int>? OptionalIds { get; set; }
    public List<int>? SelectedIds { get; set; }

}

public class GetAllDiagnoseQueryHandler : IRequestHandler<GetAllDiagnoseQuery, List<DiagnoseVM>>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public GetAllDiagnoseQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<List<DiagnoseVM>> Handle(GetAllDiagnoseQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var Diagnosis = _applicationDbContext.Diagnoses.Where(d => !d.IsDeleted);

            if (request.OptionalIds != null)
                Diagnosis = Diagnosis.Where(s => !request.OptionalIds.Contains(s.Id));

            if (request.SelectedIds != null)
                Diagnosis = Diagnosis.Where(s => request.SelectedIds.Contains(s.Id));

            var DiagnoseVMs = _mapper.Map<List<DiagnoseVM>>(Diagnosis.ToList());
            return Task.FromResult(DiagnoseVMs);
        }
        catch (Exception)
        {

            return Task.FromResult(new List<DiagnoseVM>());
        }
    }
}
