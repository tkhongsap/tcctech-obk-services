using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionTypeRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateActionType;

public class UpdateActionTypeHandler : IRequestHandler<UpdateActionTypeCommand, UpdateActionTypeResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpdateActionTypeHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpdateActionTypeResult> Handle(UpdateActionTypeCommand request, CancellationToken cancellationToken)
	{
		var createaction = new UpdateActionTypeModel(request.ATID, request.Action);
		await _uow.ActionTypeRepository.UpdateActionType(createaction, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateActionTypeResult();
	}
}
