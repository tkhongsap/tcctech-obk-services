using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationUpdate;

public class ReservationUpdateCommand : ICommand<ReservationUpdateResult>
{
    public string id { get; set; }
    public bool deleted { get; set; } = false;
    public string? status { get; set; }
}