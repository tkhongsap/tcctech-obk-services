using System.Text.RegularExpressions;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.Upsert;

public class EventHandler : IRequestHandler<EventCommand, mtSREvent>
{
    private readonly IUnitOfWork _uow;

    public EventHandler(IUnitOfWork uow)
    {
        _uow = uow;
    }

    private async Task AddEvent(mtSREvent eventEntity)
    {
        await _uow.SREventRepository.Add(eventEntity);
    }

    public async Task<mtSREvent> Handle(EventCommand request, CancellationToken cancellationToken)
    {
        var eventEntity = new mtSREvent
        {
            Name_th = request.Name_th,
            Name_en = request.Name_en,
            CreatedBy = request.CreatedBy,
            CreatedDate = request.CreatedDate,
            CreatedByName = request.CreatedByName,
            UpdatedBy = request.UpdatedBy,
            UpdatedDate = request.UpdatedDate,
            UpdatedByName = request.UpdatedByName
        };

        await AddEvent(eventEntity);
        return eventEntity;
    }
}
