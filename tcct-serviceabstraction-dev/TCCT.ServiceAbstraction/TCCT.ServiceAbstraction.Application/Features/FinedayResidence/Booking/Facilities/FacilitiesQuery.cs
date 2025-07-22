using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.Facilities;

public class FacilitiesQuery : IQuery<FacilitiesResult>
{
    public string Page { get; set; }

    public string Limit { get; set; }

    public string Types { get; set; }
    public string? Tower { get; set; }
    public int? ResidenceId { get; set; }

    public FacilitiesQuery(string page, string limit, string types, string? tower, int? residenceId) {
        Page = page;
        Limit = limit;
        Types = types;
        Tower = tower;
        ResidenceId = residenceId;
    }
}
