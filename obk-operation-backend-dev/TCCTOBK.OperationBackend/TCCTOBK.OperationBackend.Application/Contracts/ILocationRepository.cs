using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.LocationRepository;

namespace TCCTOBK.OperationBackend.Application;

public interface ILocationRepository
{
  Task<Guid> CreateLocation(CreateLocationModel data, AuditableModel auditable);
  Task UpdateLocation(UpdateLocationModel data, AuditableModel auditable);
  Task<List<Location>> GetAll(Guid? lid, string? filter, List<Guid>? idList, string? types, TableState state);
  Task<List<Location>> GetAll();
  Task<int> RemoveLocation(Guid lid);
  Task<Location> GetById(Guid id);
  Task<int> GetAllCount(Guid? lid, string? filter, List<Guid>? idList, string? types);
  Task<List<Location>> GetByType(int? typeId, int? parentId, string? types);
  Task<Location?> GetByRefId(int refId);
  Task<(int, int)> UpsertLocations(List<Location> locations);
  Task<string> GetLocationFullnamebyRefId(int refId);
}
