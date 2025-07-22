using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationUpdate;

public class ReservationUpdateResult
{
    public string? title { get; set; }
    public bool? isSync { get; set; }
    public bool? isHook { get; set; }
    public bool? isInvite { get; set; }
    public bool? isOnlineMeeting { get; set; }
    public bool? isRecurrence { get; set; }
    public string? start { get; set; }
    public string? end { get; set; }
    public string? recurrentSeriesRefId { get; set; }
    public string? repeatCondition { get; set; }
    public string? details { get; set; }
    public List<Person>? persons { get; set; }
    public string? service { get; set; }
    public Statuses? statuses { get; set; }
    public string? _id { get; set; }
    public List<Facility>? facilities { get; set; }
    public List<string>? initial_facilities { get; set; }
    public string? type { get; set; }
    public bool? deleted { get; set; }
    public string? __t { get; set; }
    public List<string>? refIds { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? initial_start { get; set; }
    public string? initial_end { get; set; }
    public int? __v { get; set; }
    public string? updatedBy { get; set; }
    public string? deletedBy { get; set; }
}


public class Person
{
    public string? name { get; set; }
    public string? email { get; set; }
    public bool? isOrganizer { get; set; }
    public bool? isAttendee { get; set; }
    public string? _id { get; set; }
    public List<Access>? access { get; set; }
}

public class Access
{
    public string? type { get; set; }
    public string? data { get; set; }
    public string? _id { get; set; }
    public string? timestamps { get; set; }
}

public class Statuses
{
    public string? currentStatus { get; set; }
    public List<Timeline>? timeline { get; set; }
}

public class Timeline
{
    public string? status { get; set; }
    public string? timestamps { get; set; }
}

public class Facility
{
    public string? _id { get; set; }
    public string? name { get; set; }
    public string? type { get; set; }
    public Area? area { get; set; }
    public string? id { get; set; }
    public Condition? condition { get; set; }
}

public class Area
{
    public string? _id { get; set; }
    public string? name { get; set; }
    public bool? enabled { get; set; }
    public bool? isRoot { get; set; }
    public List<object>? childs { get; set; }
    public string? cluster { get; set; }
    public List<string>? scopes { get; set; }
    public string? createdBy { get; set; }
    public bool? deleted { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public int? __v { get; set; }
    public string? updatedBy { get; set; }
    public string? id { get; set; }
}

public class Condition
{
    public string? reserve { get; set; }
    public string? invite { get; set; }
}