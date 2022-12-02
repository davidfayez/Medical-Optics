using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Favorite.Diagnose.Commands.Delete;

namespace Medical_Optics.Application.Favorite.Diagnose.Commands.Delete;
public class DeleteFavoriteDiagnoseCommand : IRequest<bool>
{
    public int Id { get; set; }
}

public class DeleteFavoriteDiagnoseCommandHandler : IRequestHandler<DeleteFavoriteDiagnoseCommand, bool>
{
    private readonly IApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;

    public DeleteFavoriteDiagnoseCommandHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
    {
        _applicationDbContext = applicationDbContext;
        _mapper = mapper;
    }
    public async Task<bool> Handle(DeleteFavoriteDiagnoseCommand request, CancellationToken cancellationToken)
    {
        if (request.Id > 0)
        {
            var FavoriteDiagnose = _applicationDbContext.FavoriteDiagnoses.Find(request.Id);
            if (FavoriteDiagnose != null)
            {
                FavoriteDiagnose.IsDeleted = true;
                _applicationDbContext.FavoriteDiagnoses.Update(FavoriteDiagnose);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);
                return await Task.FromResult(true);
            }
        }
        return await Task.FromResult(false);
    }
}