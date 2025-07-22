using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationByID;

public class GetReservationByIDQuery : IQuery<GetReservationByIDResult>
{
    public string Id { get; set; }
    public GetReservationByIDQuery(string id) {
        Id = id;
    }
}
