using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Domain.Entities.Def;

namespace Medical_Optics.Application.Def.Nationality.Commands.Delete;
public class DeleteNationalityCommand : IRequest<bool>, IMapFrom<DefNationality>
{
    public int Id { get; set; }
}

public class DeleteNationalityCommandHandler : IRequestHandler<DeleteNationalityCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;

    public DeleteNationalityCommandHandler(IApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }
    public async Task<bool> Handle(DeleteNationalityCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
            try
            {
                var nationality = _applicationDbContext.DefNationalities.Find(request.Id);
                if (nationality != null)
                {
                    nationality.IsDeleted = true;
                    _applicationDbContext.DefNationalities.Update(nationality);
                   await _applicationDbContext.SaveChangesAsync(cancellationToken);
                    return await Task.FromResult(true);
                }
            }
            catch (Exception)
            {
                return await Task.FromResult(false);

            }
        return await Task.FromResult(false);
    }
}
