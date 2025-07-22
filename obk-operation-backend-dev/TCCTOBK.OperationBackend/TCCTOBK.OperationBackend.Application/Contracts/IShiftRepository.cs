
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ShiftRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application;
public interface IShiftRepository
{
	Task<mtShift> GetByName(string name);
	Task<List<mtShift>> GetAll(string? name);
	Task<int> GetAllCount(string? name, DateTime? dateCheck, int? id);
	Task<mtShift> GetById(int id);
	Task<List<mtShift>> Paginate(string? name, TableState state);
	Task<int> DeleteShift(int id);
	Task<int> CreateShift(CreateShiftModel data, AuditableModel auditable);
	Task UpdateShift(UpdateShiftModel data, AuditableModel auditable);
}
