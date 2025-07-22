using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetLocationList;

public record GetLocationListResult(Paginate Paginate, List<Location> Data);