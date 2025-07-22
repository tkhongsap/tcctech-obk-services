using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Query;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp.Command;

public class GenerateQRCodeHandler : ICommandHandler<GenerateQRCodeCommand, GenerateQRCodeResult>
{
  IOPAPPUnitOfWork _uow;
  IMediator _mediator;

  public GenerateQRCodeHandler(IOPAPPUnitOfWork uow, IMediator mediator)
  {
    _uow = uow;
    _mediator = mediator;
  }
  public async Task<GenerateQRCodeResult> Handle(GenerateQRCodeCommand request, CancellationToken cancellationToken)
  {
    var location = new List<int>();
    var query = new LocationQuery();
    var result = await _mediator.Send(query);
    location = result.Data.Select(x => x.Id).ToList();
    await _uow.TimeSheet.CreateTimeSheet(location);
    await _uow.SaveChangeAsyncWithCommit();
    return new GenerateQRCodeResult();
  }
}
