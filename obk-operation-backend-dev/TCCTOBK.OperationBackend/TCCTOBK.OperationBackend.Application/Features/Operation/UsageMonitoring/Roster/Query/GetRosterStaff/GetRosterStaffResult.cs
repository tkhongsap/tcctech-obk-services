using System.Text.Json.Serialization;
using TCCTOBK.OperationBackend.Domain.Entities;


namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterStaff;

public record GetRosterStaffResult(Paginate Paginate, List<trRoster> Data);