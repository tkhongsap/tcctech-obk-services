using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.LocationRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateLocation;

public class CreateLocationHandler : IRequestHandler<CreateLocationCommand, CreateLocationResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public CreateLocationHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<CreateLocationResult> Handle(CreateLocationCommand request, CancellationToken cancellationToken)
	{
		var createLocation = new CreateLocationModel(request.SiteName, request.ZoneName, request.BuildingName, request.BuildingZoneName, request.FloorName, request.Type);
		var createResult = await _uow.LocationRepository.CreateLocation(createLocation, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateLocationResult() { LID = createResult };
	}
}
