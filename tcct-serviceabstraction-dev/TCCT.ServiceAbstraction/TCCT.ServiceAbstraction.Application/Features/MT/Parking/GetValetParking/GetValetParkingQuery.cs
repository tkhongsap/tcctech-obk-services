using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParking;

public class GetValetParkingQuery : IQuery<GetValetParkingResult>
{
    public string Uid { get; set; }
	public string? Query { get; set; }
    public int? Limit { get; set; }
    public int? Page { get; set; }
    public 	string? Sort { get; set; }
    public bool? Reverse { get; set; }

    public GetValetParkingQuery(string uid, string? query, int? limit, int? page, string? sort, bool? reverse)
	{
		Uid = uid;
		Query = query;
		Limit = limit;
		Page = page;
		Sort = sort;
		Reverse = reverse;
	}
}