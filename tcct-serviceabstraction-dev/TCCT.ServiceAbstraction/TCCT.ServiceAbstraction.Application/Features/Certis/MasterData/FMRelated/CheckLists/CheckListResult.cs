namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists;
public class CheckListResult
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string ChecklistNo { get; set; } = string.Empty;
	public int TotalDuration { get; set; }
	public bool AllLocations { get; set; }
}
