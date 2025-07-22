using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffList;
public record GetStaffListResult(Paginate Paginate, List<mtStaff> Data);