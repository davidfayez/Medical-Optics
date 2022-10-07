using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Diagnose.Queries.GetById;
public class GetDiagnoseByIdQuery : IRequest<DB.Diagnose>
{
    public int Id { get; set; }

}

public class GetDiagnoseByIdQueryHandler : IRequestHandler<GetDiagnoseByIdQuery, DB.Diagnose>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public GetDiagnoseByIdQueryHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public async Task<DB.Diagnose> Handle(GetDiagnoseByIdQuery request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        //    return await Task.FromResult(new DB.Diagnose());
        try
        {
            var diagnose = _applicationDbContext.Diagnoses.FirstOrDefault(x => x.Id == request.Id && !x.IsDeleted);
            if (diagnose != null)
                return await Task.FromResult(diagnose);

        }
        catch (Exception ex)
        {

            return await Task.FromResult(new DB.Diagnose());
        }
        return await Task.FromResult(new DB.Diagnose());
    }

}
