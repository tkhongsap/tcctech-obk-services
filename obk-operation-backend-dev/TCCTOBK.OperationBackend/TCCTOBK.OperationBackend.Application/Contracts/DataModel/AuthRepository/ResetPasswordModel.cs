namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
public class ResetPasswordModel
{
	public string Username { get; set; } = null!;
	public string NewPassword { get; set; } = null!;


}