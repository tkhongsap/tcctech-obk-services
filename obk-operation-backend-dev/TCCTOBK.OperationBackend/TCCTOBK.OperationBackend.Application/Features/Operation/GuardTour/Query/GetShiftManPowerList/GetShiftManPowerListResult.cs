using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftManPowerList;
public record GetShiftManPowerListResult(Paginate Paginate, List<mtShiftManPowerRequest> Data);