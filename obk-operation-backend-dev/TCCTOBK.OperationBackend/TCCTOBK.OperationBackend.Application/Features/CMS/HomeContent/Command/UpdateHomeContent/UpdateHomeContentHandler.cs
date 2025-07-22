using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;

public class UpdateHomeContentHandler : IRequestHandler<UpdateHomeContentCommand, UpdateHomeContentResult>
{
	IMediator _mediator;
	IUnitOfWork _uow;
	public UpdateHomeContentHandler(IMediator mediator, IUnitOfWork uow)
	{
		_mediator = mediator;
		_uow = uow;
	}
	public async Task<UpdateHomeContentResult> Handle(UpdateHomeContentCommand request, CancellationToken cancellationToken)
	{
		//call remoteconfig
		var getremoteconfigquery = new GetRemoteConfigDataQuery();
		var getremoteconfigresult = await _mediator.Send(getremoteconfigquery);
		if (!getremoteconfigresult.IsSuccess)
		{
			return new UpdateHomeContentResult() { IsSuccess = getremoteconfigresult.IsSuccess, Message = getremoteconfigresult.data };
		}
		// call update remoteconfig
		var updateremoteconfigcommand = new UpdateRemoteConfigCommand(getremoteconfigresult.data, request.ImageURL, request.IsVisible);
		var updateremoteconfigresult = await _mediator.Send(updateremoteconfigcommand);

		//call remoteconfig
		var newgetremoteconfigresult = await _mediator.Send(getremoteconfigquery);
		if (!getremoteconfigresult.IsSuccess)
		{
			return new UpdateHomeContentResult() { IsSuccess = getremoteconfigresult.IsSuccess, Message = getremoteconfigresult.data };
		}
		//store data to database
		var upserthomecontent = new HomeContentUpsert(Int32.Parse(updateremoteconfigresult.Version), request.ImageURL, request.IsVisible, request.Note, getremoteconfigresult.data, newgetremoteconfigresult.data, request.FileName, request.OriginalFileName);
		await _uow.HomeContentRepository.Create(upserthomecontent, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateHomeContentResult();
	}
}
