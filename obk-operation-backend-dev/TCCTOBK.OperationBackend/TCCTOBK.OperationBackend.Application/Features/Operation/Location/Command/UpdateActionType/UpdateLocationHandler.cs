using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.LocationRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateLocation;

public class UpdateLocationHandler : IRequestHandler<UpdateLocationCommand, UpdateLocationResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpdateLocationHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpdateLocationResult> Handle(UpdateLocationCommand request, CancellationToken cancellationToken)
	{
		var createaction = new UpdateLocationModel(request.LID, request.SiteName, request.ZoneName, request.BuildingName, request.BuildingZoneName, request.FloorName, request.Type);
		await _uow.LocationRepository.UpdateLocation(createaction, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateLocationResult();
	}
}
