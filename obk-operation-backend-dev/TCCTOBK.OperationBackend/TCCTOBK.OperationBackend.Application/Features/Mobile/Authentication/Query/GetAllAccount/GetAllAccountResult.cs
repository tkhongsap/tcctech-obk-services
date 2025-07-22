namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetAllAccount;

public class GetAllAccount
{
  public string Email { get; set; }
  public string KCUsername { get; set; }
	public string? Name { get; set; }
	public DateTime? LastLoginDateTime { get; set; }
	public string? Role { get; set; }

}

public record GetAllAccountResult(Paginate Paginate, List<GetAllAccount> Data);
