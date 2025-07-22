namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;

public class LoginResult
{
	public int user_ID { get; set; }
	public string user_Name { get; set; } = null!;
	public string? firstName { get; set; }
	public string? lastName { get; set; }
	public string? department { get; set; }
	public string? position { get; set; }
	public string? note { get; set; }
	public bool active { get; set; }
	public bool isLogIn { get; set; }
	public string token { get; set; } = null!;
	public int role_ID { get; set; }
}
