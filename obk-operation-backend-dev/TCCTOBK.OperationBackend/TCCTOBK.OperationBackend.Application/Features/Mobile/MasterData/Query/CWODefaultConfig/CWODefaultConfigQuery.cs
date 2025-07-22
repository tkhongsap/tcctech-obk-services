using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWODefaultConfig;
public class CWODefaultConfigQuery : IQuery<CWODefaultConfigResult>
{
	public int Id { get; set; }
	public CWODefaultConfigQuery(int id)
	{
		Id = id;
	}
}
