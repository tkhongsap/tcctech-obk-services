using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftList;
public record GetShiftListResult(Paginate Paginate, List<mtShift> Data);