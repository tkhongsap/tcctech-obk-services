using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceProvider;
public class FMRelatedServiceProviderQuery : IQuery<FMRelatedServiceProviderResult>
{
	public string Id { get; set; }
	public FMRelatedServiceProviderQuery(string id)
	{
		Id = id;
	}
}
