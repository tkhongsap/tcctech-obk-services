using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Config.Command.Config;

public class ConfigMarcomCommand : AuditableModel, ICommand<ConfigMarcomResult>
{
	public int Type { get; set; }

	public int Time { get; set; }
	public bool IsShowMessage {get;set;}
}
