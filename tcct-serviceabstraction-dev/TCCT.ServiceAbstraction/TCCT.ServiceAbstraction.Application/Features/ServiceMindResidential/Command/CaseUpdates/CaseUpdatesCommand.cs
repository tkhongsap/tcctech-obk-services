using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CaseUpdates;
public class CaseUpdatesCommand : ICommand<CaseUpdatesResult>
{
	public List<object> Updates { get; set; }
}