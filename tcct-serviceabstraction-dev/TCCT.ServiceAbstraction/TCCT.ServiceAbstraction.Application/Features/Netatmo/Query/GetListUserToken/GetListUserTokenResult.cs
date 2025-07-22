using TCCT.ServiceAbstraction.Domain.Netatmo.Entities;
namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.GetListUserToken;
public class GetListUserTokenResult
{
	public List<user_token_mapping> data { get; set; }
}