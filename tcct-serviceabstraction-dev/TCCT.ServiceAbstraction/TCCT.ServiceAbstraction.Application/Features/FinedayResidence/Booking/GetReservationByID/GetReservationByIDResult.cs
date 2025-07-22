using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationByID;

public class GetReservationByIDResult
{
    public string? service { get; set; }
    public Statuses? statuses { get; set; }
    public string? _id { get; set; }
    public string? title { get; set; }
    public bool? isSync { get; set; }
    public bool? isHook { get; set; }
    public bool? isInvite { get; set; }
    public bool? isOnlineMeeting { get; set; }
    public bool? isRecurrence { get; set; }
    public bool? isExternalMeeting { get; set; }
    public string? start { get; set; }
    public string? end { get; set; }
    public List<Person>? persons { get; set; }
    public List<Facility>? facilities { get; set; }
    public List<string>? initial_facilities { get; set; }
    public string? type { get; set; }
    public CreatedBy? createdBy { get; set; }
    public bool? deleted { get; set; }
    public string? __t { get; set; }
    public List<string>? ref_ { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? initial_start { get; set; }
    public string? initial_end { get; set; }
    public int? __v { get; set; }
    public UpdatedBy? updatedBy { get; set; }
}

public class Statuses
{
    public string? currentStatus { get; set; }
    public List<StatusTimeline>? timeline { get; set; }
}

public class StatusTimeline
{
    public string? timestamps { get; set; }
    public string? status { get; set; }
    public string? auditor { get; set; }
    public string? _id { get; set; }
}

public class Person
{
    public string? name { get; set; }
    public string? email { get; set; }
    public bool? isOrganizer { get; set; }
    public bool? isAttendee { get; set; }
    public List<Access>? access { get; set; }
    public string? _id { get; set; }
}

public class Access
{
    public string? type { get; set; }
    public string? data { get; set; }
    public string? timestamps { get; set; }
    public string? _id { get; set; }
}

public class Facility
{
    public Condition? condition { get; set; }
    public string? _id { get; set; }
    public string? name { get; set; }
    public string? type { get; set; }
    public List<Utility>? utilities { get; set; }
}

public class Condition
{
    public string? reserve { get; set; }
}

public class Utility
{
    public UtilityId? id { get; set; }
    public int? amount { get; set; }
    public string? _id { get; set; }
}

public class UtilityId
{
    public string? _id { get; set; }
    public string? nameTh { get; set; }
    public string? nameEn { get; set; }
    public string? icon { get; set; }
    public bool? isFixed { get; set; }
    public bool? deleted { get; set; }
    public string? _search { get; set; }
    public int? __v { get; set; }
}

public class CreatedBy
{
    public string? _id { get; set; }
    public string? email { get; set; }
    public string? displayName { get; set; }
    public List<string>? ssoProviders { get; set; }
    public string? id { get; set; }
}

public class UpdatedBy
{
    public string? _id { get; set; }
    public string? email { get; set; }
    public string? displayName { get; set; }
    public List<string>? ssoProviders { get; set; }
    public string? id { get; set; }
}
