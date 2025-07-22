using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.UpdateTask;
public class UpdateTaskCommandHandler : ICommandHandler<UpdateTaskCommand, UpdateTaskResult>
{
	private readonly ICertisService _certisservice;
	public UpdateTaskCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<UpdateTaskResult> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.UpdateTask(request.Id, request.TaskStatus, request.Remarks, request.Reading, request.UpdatedBy, request.UpdatedOn, request.DocumentId);
		return res;
	}
}
