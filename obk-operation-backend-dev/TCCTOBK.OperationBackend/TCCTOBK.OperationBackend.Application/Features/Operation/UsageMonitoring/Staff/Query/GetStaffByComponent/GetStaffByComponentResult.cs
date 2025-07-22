using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffByComponent;
public record GetStaffByComponentResult(Paginate Paginate, List<mtStaff> Data);