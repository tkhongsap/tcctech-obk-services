using Refit;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
public class AuthResponseModel
{
	public string access_token { get; set; } = default!;
	public int expires_in { get; set; }
	public string token_type { get; set; } = default!;
}
