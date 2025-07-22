using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RosterRepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.UpsertRoster;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IRosterRepository
{
	Task<List<trRoster>> GetAll(string? component, DateTime? dateCheck);
	Task<int> GetAllCount(string? component, DateTime? dateCheck, Guid? id);
	Task<trRoster> GetById(Guid id);
	Task<SumWeekDayWeekEndModel> GetSumWeekDayAndWeekEnd(string? component, DateTime? dateCheck);
	Task<trRoster> GetByIdAndEndTime(Guid id);
	Task<List<trRoster>> Paginate(string? component, TableState state);

	Task<int> DeleteRoster(Guid id);
	Task<string> UpsertRoster(UpsertRosterCommand data);
	Task UpdateRoster(UpsertRosterCommand smp, AuditableModel auditable);
	Task<List<trRoster>> GetRosterWithActive();
}