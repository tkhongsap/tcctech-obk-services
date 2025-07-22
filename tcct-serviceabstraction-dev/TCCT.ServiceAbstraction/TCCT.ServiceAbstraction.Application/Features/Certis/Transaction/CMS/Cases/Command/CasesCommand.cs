using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Command;
public class CasesCommand : ICommand<CasesResult>
{
	public string ShortDesc { get; set; } = string.Empty;
	public string? EquipmentTag { get; set; }
	public int LocationId { get; set; }
	public int EventTypeId { get; set; }
	public int? CaseTypeId { get; set; }
	public string? CaseDesc { get; set; }
	public string? Requester { get; set; }

	public CasesCommand(CasesRequest casesRequest)
	{
		ShortDesc = casesRequest.ShortDesc;
		EquipmentTag = casesRequest.EquipmentTag;
		LocationId = casesRequest.LocationId;
		EventTypeId = casesRequest.EventTypeId;
		CaseTypeId = casesRequest.CaseTypeId;
		CaseDesc = casesRequest.CaseDesc;
		Requester = casesRequest.Requester;
	}
}
