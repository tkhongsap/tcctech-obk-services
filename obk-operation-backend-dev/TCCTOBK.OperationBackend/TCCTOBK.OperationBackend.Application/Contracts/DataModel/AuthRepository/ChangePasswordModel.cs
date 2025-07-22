namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
public class ChangePasswordModel
{
	public string Username { get; set; } = null!;
	public string OldPassword { get; set; } = null!;
	public string NewPassword { get; set; } = null!;
}