namespace TCCT.ServiceAbstraction.Domain.Netatmo.Entities;
public class user_token
{
	public Guid utid { get; set; }
	public string email { get; set; } = null!;
	public string client_id { get; set; } = null!;
	public string client_secret { get; set; } = null!;
	public string refresh_token { get; set; } = null!;
	public DateTime? refresh_date { get; set; }
}
