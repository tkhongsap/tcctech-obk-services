using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;

public class GetStaffRoleMappingResult {
    public int? StaffId { get; set; }
    public Staff? Staff { get; set; }
    public int? LocationId { get; set; }
    public Location? Location { get; set; }
    public int? FunctionRoleId { get; set; }
    public FunctionRole? FunctionRole { get; set; }
}

public class Staff
{
    public int? Id { get; set; }
    public string? FullName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Company { get; set; }
    public string? StaffId { get; set; }
    public bool? LoginEnabled { get; set; }
    public string? Email { get; set; }
    public string? Mobile { get; set; }
    public int? Status { get; set; }
    public string? Username { get; set; }
    public string? NRIC { get; set; }
}

public class Location
{
    public int? Id { get; set; }
    public string? LocationCode { get; set; }
    public int? LocationTypeId { get; set; }
    public string? Name { get; set; }
    public string? FullName { get; set; }
    public int? TopLocationId { get; set; }
    public int? ParentLocationId { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? CreatedOn { get; set; }
    public Guid? ModifiedBy { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public string? ExternalReference { get; set; }
}

public class FunctionRole
{
    public int? Id { get; set; }
    public string? Code { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    [JsonPropertyName("sys")]
    public bool? Sys { get; set; }
}
