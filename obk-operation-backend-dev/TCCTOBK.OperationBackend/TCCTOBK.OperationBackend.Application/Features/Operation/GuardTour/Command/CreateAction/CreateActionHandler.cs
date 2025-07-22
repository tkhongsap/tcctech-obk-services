using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateAction;

public class CreateActionHandler : IRequestHandler<CreateActionCommand, CreateActionResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public CreateActionHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<CreateActionResult> Handle(CreateActionCommand request, CancellationToken cancellationToken)
	{
		await _uow.ActionTypeRepository.GetById(request.ATID);
		var createaction = new CreateActionModel(request.Name, request.Description, request.ATID, request.MetaData);
		var createResult = _uow.ActionRepository.CreateAction(createaction, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateActionResult() { AID = createResult };
	}
}
