using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SchedulePlanRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateSchedulePlan;

public class CreateSchedulePlanHandler : IRequestHandler<CreateSchedulePlanCommand, CreateSchedulePlanResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public CreateSchedulePlanHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<CreateSchedulePlanResult> Handle(CreateSchedulePlanCommand request, CancellationToken cancellationToken)
	{
		var createDataList = new List<CreateSchedulePlanModel>();
		foreach (var item in request.CreateData)
		{
			createDataList.Add(new CreateSchedulePlanModel(item.Route, item.Frequency, item.StartTime, item.EndTime, item.MemberId, item.IsActive));
		}
		var createResult = await _uow.SchedulePlanRepository.CreateSchedulePlan(createDataList, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateSchedulePlanResult() { SchedulePlanIds = createResult };
	}
}
