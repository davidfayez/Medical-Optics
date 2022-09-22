using Medical_Optics.Domain.Common;

namespace Medical_Optics.Application.Common.Interfaces;

public interface IDomainEventService
{
    Task Publish(DomainEvent domainEvent);
}
