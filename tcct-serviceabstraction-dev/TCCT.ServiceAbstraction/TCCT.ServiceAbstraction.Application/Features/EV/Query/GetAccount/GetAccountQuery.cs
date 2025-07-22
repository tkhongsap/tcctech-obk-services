using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetAccount;
public class GetAccountQuery : IQuery<GetAccountResult>
{
	public required string token { get; set; }
}
