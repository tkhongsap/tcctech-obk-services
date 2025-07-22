using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitor;
public class AddVisitorHandler : ICommandHandler<AddVisitorCommand, AddVisitorResult>
{
	private readonly IServiceMindResidential _service;
	public AddVisitorHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<AddVisitorResult> Handle(AddVisitorCommand request, CancellationToken cancellationToken)
	{
		return await _service.AddVisitor(request);
	}
}