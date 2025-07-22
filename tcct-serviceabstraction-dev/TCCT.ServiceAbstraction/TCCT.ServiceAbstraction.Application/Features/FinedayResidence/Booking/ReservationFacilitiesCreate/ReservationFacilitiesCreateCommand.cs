using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesCreate;

public class ReservationFacilitiesCreateCommand : ICommand<ReservationFacilitiesCreateResult>
{
    public string id { get; set; }
    public string? Title { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string? Details { get; set; }
    public int ResidenceId { get; set; }
    public List<PersonCreate> Persons { get; set; }
    public StatusesCreate? Statuses { get; set; }
}

public class StatusesCreate
{
    public string? CurrentStatus { get; set; }
    public List<TimelineCreate>? Timeline { get; set; }
}

public class TimelineCreate
{
    public object? status { get; set; }
    public object? timestamps { get; set; }
    public object? _id { get; set; }
}
