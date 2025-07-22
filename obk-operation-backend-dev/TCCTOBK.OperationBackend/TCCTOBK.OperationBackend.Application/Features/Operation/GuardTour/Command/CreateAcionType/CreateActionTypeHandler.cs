using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionTypeRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActionType;

public class CreateActionTypeHandler : IRequestHandler<CreateActionTypeCommand, CreateActionTypeResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public CreateActionTypeHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<CreateActionTypeResult> Handle(CreateActionTypeCommand request, CancellationToken cancellationToken)
	{
		var createaction = new CreateActionTypeModel(request.Action);
		var createResult = await _uow.ActionTypeRepository.CreateActionType(createaction, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateActionTypeResult() { ATID = createResult };
	}
}
