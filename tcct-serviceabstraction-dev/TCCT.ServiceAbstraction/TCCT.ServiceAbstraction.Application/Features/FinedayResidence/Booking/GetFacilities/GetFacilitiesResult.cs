using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetFacilities;

public class GetFacilitiesResult
{
    public List<GetFacilitiesResultData>? docs { get; set; }
    public int totalDocs { get; set; }
    public int limit { get; set; }
    public int totalPages { get; set; }
    public int page { get; set; }
    public int pagingCounter { get; set; }
    public bool hasPrevPage { get; set; }
    public bool hasNextPage { get; set; }
    public int? prevPage { get; set; }
    public int? nextPage { get; set; }
}

public class GetFacilitiesResultData
{
    public Condition? condition { get; set; }
    public string? _id { get; set; }
    public string? name { get; set; } 
    public string? type { get; set; }
    public List<Utility>? utilities { get; set; }
    public Area? area { get; set; }
    public List<Sync>? sync { get; set; }
    public CreatedBy? createdBy { get; set; }
    public bool? deleted { get; set; }
    public string? image { get; set; }
    public string? imageUrl { get; set; }
    public string? thumbnailUrl { get; set; }
    public string? id { get; set; }
    public UpdatedBy? updatedBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public int? __v { get; set; }
}

public class Condition
{
    public Reserve? reserve { get; set; }
}

public class Reserve
{
    public Period? period { get; set; }
    public CheckinTimeAllow? checkinTimeAllow { get; set;}
    public string? _id { get; set; }
    public bool? isApproveRequired { get; set; }
    public bool? isCheckinRequired { get; set; }
    public bool? isInvitation { get; set; }
    public string? reserveTimeLimit { get; set; }
    public string? releaseTime { get; set; }
    public bool? isIndividually { get; set; }
    public bool? isAllowSameTime { get; set; }
    public bool? isAllowExtendTime { get; set; }
    public string? name { get; set; }
    public bool? enabled { get; set; }
    public List<string>? facilities { get; set; }
    public string? cluster { get; set; }
    public string? createdBy { get; set; }
    public bool? deleted { get; set; }
    public string? __t { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public int? __v { get; set; }
    public string? updatedBy { get; set; }
}

public class Period
{
    public string? start { get; set; }
    public string? end { get; set; }
}

public class CheckinTimeAllow
{
    public bool? allow { get; set; }
    public string? time { get; set; }
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

public class Area
{
    public string? _id { get; set; }
    public string? name { get; set; }
    public string? id { get; set; }
}

public class Sync
{
    public string? _id { get; set; }
    public string? id { get; set; }
    public string? type { get; set; }
    public Config? config { get; set; }
}

public class Config
{
    public string? _id { get; set; }
    public string? name { get; set; }
    public string? provider { get; set; }
    public string? type { get; set; }
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

