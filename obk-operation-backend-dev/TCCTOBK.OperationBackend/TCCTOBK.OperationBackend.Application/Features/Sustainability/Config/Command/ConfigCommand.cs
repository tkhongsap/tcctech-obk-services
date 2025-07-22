using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.Config.Command.Config;

public class ConfigCommand : AuditableModel, ICommand<ConfigResult>
{
	public int Type { get; set; }
	public int Time { get; set; }
}
