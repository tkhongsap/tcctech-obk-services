using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ShiftRepository;
namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateShift;

public class CreateShiftHandler : IRequestHandler<CreateShiftCommand, CreateShiftResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public CreateShiftHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<CreateShiftResult> Handle(CreateShiftCommand request, CancellationToken cancellationToken)
	{
		var createShift = new CreateShiftModel(
			request.Name,
			request.StartTime ?? TimeSpan.Zero,
			request.EndTime ?? TimeSpan.Zero,
			request.AllowCheckInStart ?? TimeSpan.Zero,
			request.AllowCheckInEnd ?? TimeSpan.Zero,
			request.CheckoutTimeEnd ?? TimeSpan.Zero,
			request.IsOverNight ?? 0
		);
		var createResult = await _uow.ShiftRepository.CreateShift(createShift, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateShiftResult() { Id = createResult };
	}
}
