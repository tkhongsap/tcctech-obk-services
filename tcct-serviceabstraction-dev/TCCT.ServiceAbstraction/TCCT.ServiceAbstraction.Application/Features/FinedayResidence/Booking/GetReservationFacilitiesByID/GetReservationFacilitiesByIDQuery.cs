using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationFacilitiesByID;

public class GetReservationFacilitiesByIDQuery : IQuery<GetReservationFacilitiesByIDResult>
{
    public string Id { get; set; }
    public GetReservationFacilitiesByIDQuery(string id) {
        Id = id;
    }
}
