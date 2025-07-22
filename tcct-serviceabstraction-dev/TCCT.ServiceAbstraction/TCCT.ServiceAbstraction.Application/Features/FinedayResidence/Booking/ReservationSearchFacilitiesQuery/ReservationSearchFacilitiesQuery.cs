using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchFacilitiesQuery;

public class ReservationSearchFacilitiesQuery : IQuery<List<ReservationSearchFacilitiesQueryResult>>
{
    public string? Title { get; set; } = null;
    public string? Facilities { get; set; } = null;
    public string Start { get; set; }
    public string End { get; set; }
    public string? Status { get; set; }
    public string? Organizer { get; set; }
    public bool? Hasdetails { get; set; }
    public int? Page { get; set; }
    public int? Perpage { get; set; }
    public bool? History { get; set; }
    public int? ResidenceId { get; set; }

    public ReservationSearchFacilitiesQuery(string? title, string? facilities, string start, string end, string? status, string? organizer, bool? hasdetails, int? page, int? perpage, bool? history, int? residenceId) {
        Title = title;
        Facilities = facilities;
        Start = start;
        End = end;
        Status = status;
        Organizer = organizer;
        Hasdetails = hasdetails;
        Page = page;
        Perpage = perpage;
        History = history;
        ResidenceId = residenceId;
    }
}
