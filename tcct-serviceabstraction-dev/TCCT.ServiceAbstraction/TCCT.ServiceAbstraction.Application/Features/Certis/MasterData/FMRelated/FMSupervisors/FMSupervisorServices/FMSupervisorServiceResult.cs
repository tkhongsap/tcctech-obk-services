namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors.FMSupervisorServices;
public class FMSupervisorServiceResult
{
	public int Id { get; set; }
	public string SupervisorId { get; set; } = null!;
	public int LocationId { get; set; }
	public bool IsDefault { get; set; }
}
