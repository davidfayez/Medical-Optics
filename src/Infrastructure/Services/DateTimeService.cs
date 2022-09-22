using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Infrastructure.Services;

public class DateTimeService : IDateTime
{
    public DateTime Now => DateTime.Now;
}
