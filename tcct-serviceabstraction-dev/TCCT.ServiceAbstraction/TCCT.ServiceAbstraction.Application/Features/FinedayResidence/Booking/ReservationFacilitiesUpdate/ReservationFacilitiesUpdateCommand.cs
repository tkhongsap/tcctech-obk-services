using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesUpdate;

public class ReservationFacilitiesUpdateCommand : ICommand<ReservationFacilitiesUpdateResult>
{
    public string id { get; set; }
    public string? Title { get; set; }
    public DateTime? Start { get; set; }
    public DateTime? End { get; set; }
    public string? Details { get; set; }
    public int? ResidenceId { get; set; }
    public List<PersonUpdate>? Persons { get; set; }
    public StatusesUpdate? Statuses { get; set; }
}

public class StatusesUpdate
{
    public string? CurrentStatus { get; set; }
    public List<TimelineUpdate>? Timeline { get; set; }
}

public class TimelineUpdate
{
    public object? status { get; set; }
    public object? timestamps { get; set; }
    public object? _id { get; set; }
}

public class PersonUpdate
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public bool? IsOrganizer { get; set; }
    public bool? IsAttendee { get; set; }
}