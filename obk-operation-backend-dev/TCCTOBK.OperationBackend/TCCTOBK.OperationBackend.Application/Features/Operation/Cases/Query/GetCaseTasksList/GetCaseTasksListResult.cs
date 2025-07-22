using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseTasksList;

public record GetCaseTasksListData
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int CaseId { get; set; }
    public int? StatusCode { get; set; }
    public string StatusCodeText
    {
        get
        {
            return StatusCode switch
            {
                1 => "Open",
                2 => "In Progress",
                3 => "Canceled",
                4 => "Complete",
                5 => "Rejected",
                _ => "Unknown Status"
            };
        }
    }
    public int? Sequence { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedOn { get; set; }
    public string? ModifiedBy { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public bool? IsCritical { get; set; }
    public int? AssignedStaffId { get; set; }
    public string? AssignedStaffDisplayName { get; set; }
    public int? TaskCategoryId { get; set; }
    public GetCase Case { get; set; } = new GetCase();
    public StatusData StatusData = new StatusData();
}

public record StatusData
{
    public int Open { get; set; }
    public int Inprogress { get; set; }
    public int Complete { get; set; }
}


public record GetCase
{
    public int Id { get; set; }
    public string? ShortDesc { get; set; }
    public string? CaseNo { get; set; }
    public int? EventTypeId { get; set; }
    public string? EventTypeCode { get; set; }
    public int? LocationId { get; set; }
    public string? LocationCode { get; set; }
    public string? LocationName { get; set; }
    public string? LocationFullname { get; set; }
    public int? PriorityLevelId { get; set; }
    public int? SiteHandler { get; set; }
    public int? StatusCode { get; set; }
    public string StatusCodeText
    {
        get
        {
            return StatusCode switch
            {
                1 => "Open",
                2 => "In Progress",
                3 => "Canceled",
                4 => "Complete",
                5 => "Rejected",
                _ => "Unknown Status"
            };
        }
    }
    public string? Timestamp { get; set; }
    public DateTime? CreatedOn { get; set; }
    public int? SlaConfigId { get; set; }
    public int? CaseTypeId { get; set; }
    public string? CreatedBy { get; set; }
    public bool? SlaFailed { get; set; }
    public DateTime? SlaDate { get; set; }
    public string? Description { get; set; }
    public string? EquipmentTag { get; set; }
    public string? ExternalRefNo { get; set; }
    public bool? IsCritical { get; set; }
    public string? PriorityText { get; set; }
    public int? SyncStatus { get; set; }
    public int? SyncUtcTs { get; set; }
}

public record GetCaseTasksListResult(Paginate Paginate, List<GetCaseTasksListData> Data, StatusData statusData);