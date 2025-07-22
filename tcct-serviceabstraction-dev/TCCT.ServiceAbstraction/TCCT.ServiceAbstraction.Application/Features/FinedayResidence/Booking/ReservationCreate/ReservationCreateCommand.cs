using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationCreate;

public class ReservationCreateCommand : ICommand<ReservationCreateResult>
{
    public string id { get; set; }
    public string? Title { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string? Details { get; set; }
    public List<Person> Persons { get; set; }
}

public class Person
{
    public string Name { get; set; }
    public string Email { get; set; }
    public bool IsOrganizer { get; set; }
    public bool IsAttendee { get; set; }
}
