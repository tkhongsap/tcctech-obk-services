using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpsertShiftManPowerCommand;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IShiftManPowerRequestRepository
{
	Task<List<mtShiftManPowerRequest>> GetAll(string? shiftName, DateTime? dateCheck);
	Task<int> GetAllCount(string? shiftName, DateTime? dateCheck, int? id);
	Task<mtShiftManPowerRequest> GetById(int id);
	Task<List<mtShiftManPowerRequest>> Paginate(string? shiftName, DateTime? dateCheck, TableState state);
	Task<int> CreateShiftManPower(UpsertShiftManPowerCommandCommand smp, AuditableModel auditable);
	Task<int> DeleteShiftManPower(int id);
	Task UpdateShiftManPower(UpsertShiftManPowerCommandCommand smp, AuditableModel auditable);
}