namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Priorities;
public class PriorityResult
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string ColorCode { get; set; } = null!;
	public bool IsCritical { get; set; }
}
