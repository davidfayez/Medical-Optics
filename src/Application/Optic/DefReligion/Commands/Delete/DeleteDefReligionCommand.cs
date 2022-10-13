using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.DefCountry.Commands.Delete;
using DB = Medical_Optics.Domain.Entities.Def;


namespace Medical_Optics.Application.Optic.DefReligion.Commands.Delete;
public class DeleteDefReligionCommand:IRequest<bool>,IMapFrom<DB.DefCountry>
{
    public int Id { get; set; }
}

public class DeleteDefReligionCommandHandler : IRequestHandler<DeleteDefReligionCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteDefReligionCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public Task<bool> Handle(DeleteDefReligionCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
            try
            {
                var religion = _applicationDbContext.DefReligions.Find(request.Id);
                if (religion != null)
                {
                    religion.IsDeleted = true;
                    _applicationDbContext.DefReligions.Update(religion);
                    _applicationDbContext.SaveChangesAsync(cancellationToken);
                    return Task.FromResult(true);
                }
            }
            catch (Exception)
            {
                return Task.FromResult(false);

            }
        return Task.FromResult(false);

    }
}

