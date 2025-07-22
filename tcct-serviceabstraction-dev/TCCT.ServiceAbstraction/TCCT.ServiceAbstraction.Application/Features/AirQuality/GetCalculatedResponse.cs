using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality;

public class GetCalculatedResponse
{
	public string? sensor { get; set; }
	public string? channel { get; set; }
	public string? tag { get; set; }
	public string? type { get; set; }
	public string? status { get; set; }
	public string? netid { get; set; }
	public int chid { get; set; }
	public string? timezone { get; set; }
	public string? unit { get; set; }
	public string? site { get; set; }
	public string? zone { get; set; }
	public string? tower { get; set; }
	public string? component { get; set; }
	public string? floor { get; set; }
	public string? space { get; set; }
	public string? subspace { get; set; }
	public string? locationCode { get; set; }
	public string? buildingName { get; set; }
	public string? buildingCode { get; set; }
	public string? floorName { get; set; }
	public string? floorCode { get; set; }

	[JsonPropertyName("address(CCDD)")]
	public string? addressCCDD { get; set; }

	[JsonPropertyName("address code")]
	public string? addressCode { get; set; }
	public string? mainSystemName { get; set; }
	public string? mainSystemCode { get; set; }
	public string? subSystemName { get; set; }
	public string? subSystemCode { get; set; }
	public string? equipmentName { get; set; }
	public string? equipmentCode { get; set; }
	public string? sequenceNo { get; set; }
	public string? equipmentFullName { get; set; }
	public string? equipmentFullCode { get; set; }
	public List<GetCalculatedDataResult> data { get; set; } = new();
}
