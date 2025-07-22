namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceProviders;
public class ServiceProviderResult
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string Description { get; set; } = string.Empty;
	public string Phone { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Address { get; set; } = string.Empty;
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
	public DateTime ModifiedOn { get; set; }
}
