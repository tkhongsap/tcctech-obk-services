using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Command;
public class CasesRequest
{
	public string ShortDesc { get; set; } = string.Empty;
	public string? EquipmentTag { get; set; }
	public int LocationId { get; set; }
	public int EventTypeId { get; set; }
	public int? CaseTypeId { get; set; }
	public string? CaseDesc { get; set; }
	public string? Requester { get; set; }

	public CasesRequest()
	{
		ShortDesc = string.Empty;
		EquipmentTag = string.Empty;
		LocationId = 0;
		EventTypeId = 0;
		CaseDesc = string.Empty;
	}
	public CasesRequest(string shortDesc, string? equipmentTag, int locationId, int eventTypeId, int? caseTypeId, string? caseDesc, string? requester)
	{
		ShortDesc = shortDesc;
		EquipmentTag = equipmentTag;
		LocationId = locationId;
		EventTypeId = eventTypeId;
		CaseTypeId=caseTypeId;
		CaseDesc = caseDesc;
		Requester = requester;
	}
}
