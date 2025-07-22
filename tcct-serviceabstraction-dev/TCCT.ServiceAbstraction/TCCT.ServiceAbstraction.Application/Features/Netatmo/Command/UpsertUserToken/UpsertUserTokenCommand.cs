using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpsertUserToken;
public class UpsertUserTokenCommand : ICommand<UpsertUserTokenResult>
{
	public List<UpsertUserTokenData>? Data { get; set; } = null!;
}

public class UpsertUserTokenData
{
	public string User { get; set; } = null!;
	public string ClientId { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;
	public string Refreshtoken { get; set; } = null!;
	public string HomeId { get; set; } = null!;
	public string? TenantId { get; set; } = null!;
}