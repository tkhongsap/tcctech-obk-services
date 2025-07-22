namespace TCCTOBK.OperationBackend.Application;

public class GetResetPasswordResult
{
	public bool isVerify { get; set; } = true;
	public string Message { get; set; } = "Verify Reset Password Code";
	public string Email { get; set; } = default!;
	public string KeyCloakUserName { get; set; } = default!;
}
