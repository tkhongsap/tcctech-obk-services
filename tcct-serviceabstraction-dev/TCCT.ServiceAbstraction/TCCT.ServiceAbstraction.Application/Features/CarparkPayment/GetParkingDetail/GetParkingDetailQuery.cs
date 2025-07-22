using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GetParkingDetail;
public class GetParkingDetailQuery : IQuery<GetParkingDetailResult>
{
	public string Search { get; set; }
	public bool LostCard { get; set; }

	public GetParkingDetailQuery(string search, bool lostcard)
	{
		Search = search;
		LostCard = lostcard;
	}
}
