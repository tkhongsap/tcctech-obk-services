using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchQuery;

public class ReservationSearchQuery : IQuery<List<ReservationSearchQueryResult>>
{
    public string? Title { get; set; } = null;
    public string? Facilities { get; set; } = null;
    public string Start { get; set; }
    public string End { get; set; }
    public string? Status { get; set; }
    public string? Organizer { get; set; }
    public bool? Hasdetails { get; set; }

    public ReservationSearchQuery(string? title, string? facilities, string start, string end, string? status, string? organizer, bool? hasdetails) {
        Title = title;
        Facilities = facilities;
        Start = start;
        End = end;
        Status = status;
        Organizer = organizer;
        Hasdetails = hasdetails;
    }
}
