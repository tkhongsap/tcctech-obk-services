namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.CreateUserKC;

public class CreateUserKCResult
{
	public Guid MID { get; set; }
	public bool IsCreateFunctionRole { get; set; } = true;
}