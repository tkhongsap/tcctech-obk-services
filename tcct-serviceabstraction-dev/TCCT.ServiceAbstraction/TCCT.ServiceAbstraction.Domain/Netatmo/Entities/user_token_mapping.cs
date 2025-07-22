namespace TCCT.ServiceAbstraction.Domain.Netatmo.Entities;
public class user_token_mapping
{
	public Guid utid { get; set; }
	public string tenant_id { get; set; } = null!;
	public string home_id { get; set; } = null!;
	public user_token? user_token { get; set; }
}
