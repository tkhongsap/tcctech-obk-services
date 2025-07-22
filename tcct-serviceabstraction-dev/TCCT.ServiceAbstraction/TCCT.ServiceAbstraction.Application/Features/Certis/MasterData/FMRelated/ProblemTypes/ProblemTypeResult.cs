namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ProblemTypes;
public class ProblemTypeResult
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public int PriorityId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int ChecklistId { get; set; }
}
