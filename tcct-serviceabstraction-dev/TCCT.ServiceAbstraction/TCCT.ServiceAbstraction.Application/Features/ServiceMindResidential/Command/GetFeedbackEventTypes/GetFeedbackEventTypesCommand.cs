using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetFeedbackEventTypes;
public class GetFeedbackEventTypesCommand : ICommand<GetFeedbackEventTypesResult>
{
	public string TenantId { get; set; }
}