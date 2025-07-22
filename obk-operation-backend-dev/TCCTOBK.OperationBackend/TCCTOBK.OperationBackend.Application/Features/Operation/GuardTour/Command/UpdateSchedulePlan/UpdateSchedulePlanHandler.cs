using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SchedulePlanRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateSchedulePlan;

public class UpdateSchedulePlanHandler : IRequestHandler<UpdateSchedulePlanCommand, UpdateSchedulePlanResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpdateSchedulePlanHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpdateSchedulePlanResult> Handle(UpdateSchedulePlanCommand request, CancellationToken cancellationToken)
	{
		var createaction = new UpdateSchedulePlanModel(request.SDPID, request.Route, request.Frequency, request.StartTime, request.EndTime, request.MemberId, request.IsActive);
		await _uow.SchedulePlanRepository.UpdateSchedulePlan(createaction, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateSchedulePlanResult();
	}
}
