using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceMember;
public class GetDataResidenceMemberCommand : ICommand<GetDataResidenceMemberResult>
{
	public string Search { get; set; }
	public int? Page { get; set; }
	public int? Perpage { get; set; }
	public string? StartDate { get; set; }
	public string? EndDate { get; set; }
	public bool? Active { get; set; }


	public GetDataResidenceMemberCommand(string search, int? page, int? perpage, string? startDate, string? endDate, bool? active)
	{
		Search = search;
		Page = page;
		Perpage = perpage;
		StartDate = startDate;
		EndDate = endDate;
		Active = active;
	}
}
