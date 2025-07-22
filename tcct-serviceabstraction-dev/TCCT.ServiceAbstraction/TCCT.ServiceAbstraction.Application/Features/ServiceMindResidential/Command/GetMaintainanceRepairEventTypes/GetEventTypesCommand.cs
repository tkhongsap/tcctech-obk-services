using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetEventTypes;
public class GetEventTypesCommand : ICommand<GetEventTypesResult>
{
	public string TenantId { get; set; }
	public GetEventTypesFilter? Filter { get; set; } = new GetEventTypesFilter();
}

public class GetEventTypesFilter
{ 	public int? LocationType { get; set; }
}