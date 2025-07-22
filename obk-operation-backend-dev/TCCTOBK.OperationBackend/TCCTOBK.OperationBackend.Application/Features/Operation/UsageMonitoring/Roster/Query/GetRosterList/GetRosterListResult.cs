using System.Text.Json.Serialization;
using TCCTOBK.OperationBackend.Domain.Entities;


namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterList;

public record GetRosterListResult(Paginate Paginate, List<trRoster> Data);