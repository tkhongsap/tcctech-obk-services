using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedChecklist;
public class FMRelatedChecklistQuery : IQuery<FMRelatedChecklistResult>
{
	public string Name { get; set; }
	public FMRelatedChecklistQuery(string name)
	{
		Name = name;
	}
}
