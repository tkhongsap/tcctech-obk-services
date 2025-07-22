using System.Text.Json.Serialization;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetFunctionRoles;

public partial class GetFunctionRolesAPIResult
{
	[JsonPropertyName("staffId")]
	public int staffId { get; set; }

	[JsonPropertyName("staff")]
	public Staff? staff { get; set; }

	[JsonPropertyName("locationId")]
	public int? LocationId { get; set; }

	[JsonPropertyName("location")]
	public Location? location { get; set; }

	[JsonPropertyName("functionRoleId")]
	public int? FunctionRoleId { get; set; }

	[JsonPropertyName("functionRole")]
	public FunctionRole? functionRole { get; set; }
}

public partial class FunctionRole
{
	[JsonPropertyName("id")]
	public int? id { get; set; }

	[JsonPropertyName("code")]
	public string? code { get; set; }

	[JsonPropertyName("name")]
	public string? name { get; set; }

	[JsonPropertyName("description")]
	public string? description { get; set; }

	[JsonPropertyName("sys")]
	public bool? sys { get; set; }
}

public partial class Location
{
	[JsonPropertyName("id")]
	public int? id { get; set; }

	[JsonPropertyName("locationCode")]
	public string? locationCode { get; set; }

	[JsonPropertyName("locationTypeId")]
	public int? locationTypeId { get; set; }

	[JsonPropertyName("name")]
	public string? name { get; set; }

	[JsonPropertyName("fullName")]
	public string? fullName { get; set; }

	[JsonPropertyName("topLocationId")]
	public int? topLocationId { get; set; }

	[JsonPropertyName("parentLocationId")]
	public int? parentLocationId { get; set; }

	[JsonPropertyName("createdBy")]
	public Guid? createdBy { get; set; }

	[JsonPropertyName("createdOn")]
	public DateTime? createdOn { get; set; }

	[JsonPropertyName("modifiedBy")]
	public Guid? modifiedBy { get; set; }

	[JsonPropertyName("modifiedOn")]
	public DateTime? modifiedOn { get; set; }

	[JsonPropertyName("externalReference")]
	public string? externalReference { get; set; }
}

public partial class Staff
{
	[JsonPropertyName("id")]
	public int? id { get; set; }

	[JsonPropertyName("fullName")]
	public string? fullName { get; set; }

	[JsonPropertyName("firstName")]
	public string? firstName { get; set; }

	[JsonPropertyName("lastName")]
	public string? lastName { get; set; }

	[JsonPropertyName("company")]
	public string? company { get; set; }

	[JsonPropertyName("staffId")]
	public Guid staffId { get; set; }

	[JsonPropertyName("loginEnabled")]
	public bool? loginEnabled { get; set; }

	[JsonPropertyName("email")]
	public string? email { get; set; }

	[JsonPropertyName("mobile")]
	public string? mobile { get; set; }

	[JsonPropertyName("status")]
	public int? status { get; set; }

	[JsonPropertyName("username")]
	public string? username { get; set; }

	[JsonPropertyName("nric")]
	public string? nric { get; set; }
}
