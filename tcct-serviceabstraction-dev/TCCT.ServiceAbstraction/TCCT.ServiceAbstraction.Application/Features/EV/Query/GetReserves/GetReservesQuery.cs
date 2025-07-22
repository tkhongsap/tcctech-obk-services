using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserves;

public class GetReservesQuery : IQuery<GetReservesResult>
{
	public required string token { get; set; }
	public string? month { get; set; }
	public int? pageLimit { get; set; }
	public int? pageLast { get; set; }
	public int? status { get; set; }
}
