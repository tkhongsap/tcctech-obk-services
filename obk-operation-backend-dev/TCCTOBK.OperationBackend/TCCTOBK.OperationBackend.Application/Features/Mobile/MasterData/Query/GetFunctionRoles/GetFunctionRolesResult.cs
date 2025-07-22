using System.Text.Json.Serialization;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetFunctionRoles;

public class GetFunctionRolesResult
{
	public int? Id { get; set; }
	public string? Code { get; set; }
	public string? Name { get; set; }
	public string? Description { get; set; }
	[JsonPropertyName("sys")]
	public bool? Sys { get; set; }
}
