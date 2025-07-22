namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.FMTechnician.Model;
public class FMTechnicianItem
{
	public string Id { get; set; }
	public string Email { get; set; }
	public string Mobile { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string FullName { get; set; }
	public bool Disabled { get; set; }
	public FMTechnicianItem(FMTechnicianResult data)
	{
		Id = data.Id;
		Email = data.Email;
		Mobile = data.Mobile;
		FirstName = data.FirstName;
		LastName = data.LastName;
		FullName = data.FullName;
		Disabled = data.Disabled;
	}
}
