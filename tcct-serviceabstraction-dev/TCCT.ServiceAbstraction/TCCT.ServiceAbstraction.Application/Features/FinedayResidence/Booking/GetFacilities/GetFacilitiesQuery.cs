using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetFacilities;

public class GetFacilitiesQuery : IQuery<GetFacilitiesResult>
{
    public string Page { get; set; }

    public string Limit { get; set; }

    public string Types { get; set; }

    public GetFacilitiesQuery(string page, string limit, string types) {
        Page = page;
        Limit = limit;
        Types = types;
    }
}
