using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateAction;

public class UpdateActionHandler : IRequestHandler<UpdateActionCommand, UpdateActionResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpdateActionHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpdateActionResult> Handle(UpdateActionCommand request, CancellationToken cancellationToken)
	{
		var createaction = new UpdateActionModel(request.AID, request.Name, request.Description, request.MetaData);
		await _uow.ActionRepository.UpdateAction(createaction, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateActionResult();
	}
}
