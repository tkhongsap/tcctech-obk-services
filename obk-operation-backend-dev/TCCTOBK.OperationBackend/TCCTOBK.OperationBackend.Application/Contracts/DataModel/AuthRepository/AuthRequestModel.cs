namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
public class AuthRequestModel
{
	public string client_id { get; set; } = default!;
	public string client_secret { get; set; } = default!;
	public string grant_type { get; set; } = default!;
}
