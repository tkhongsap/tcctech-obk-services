using System;
using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.CheckRedemptionStatusByEmail;

public class CheckRedemptionStatusByEmailResult
{
    public string? tenantId { get; set; }
    public string? userID { get; set; }
    public string? username { get; set; }
    public string? firstname { get; set; }
    public string? lastname { get; set; }
    public string? email { get; set; }
    public string? userLevel { get; set; }
    public string? redempType { get; set; }
    public string? departmentId { get; set; }
    public int? isUse { get; set; }
    public List<ResidenceId> residenceId { get; set; }
}

public class ResidenceId
{
    public int? residentID { get; set; }
    public bool? active { get; set; }
}