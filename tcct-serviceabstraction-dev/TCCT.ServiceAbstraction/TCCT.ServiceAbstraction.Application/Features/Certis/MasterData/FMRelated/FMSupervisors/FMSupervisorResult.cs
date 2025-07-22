namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors;
public class FMSupervisorResult
{
	public string Id { get; set; } = null!;
	public string Email { get; set; } = string.Empty;
	public string FullName { get; set; } = string.Empty;
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public bool Disabled { get; set; }
}
