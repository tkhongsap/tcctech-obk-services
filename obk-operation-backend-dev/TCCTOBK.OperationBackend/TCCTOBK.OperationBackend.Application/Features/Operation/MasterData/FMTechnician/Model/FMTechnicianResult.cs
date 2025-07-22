namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.FMTechnician.Model;
public class FMTechnicianResult
{
	public string Id { get; set; }
	public string Email { get; set; }
	public string Mobile { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string FullName { get; set; }
	public bool Disabled { get; set; }
	public int serviceCategoryId { get; set; }
}
