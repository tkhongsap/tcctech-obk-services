
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.EventsLogRepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.EventLogs.Command.CreateEventLog;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application;
public interface IEventsLogRepository
{
	Task<List<EventsLog>> GetAll(Guid? username, DateTime? startDate);
	Task<int> GetAllCount(Guid? username, DateTime? startDate);
	Task<int> CountGroupUser();
	Task<EventsLog> GetById(int id);
	Task<List<EventsLog>> Paginate(DateTime? startDate, Guid? username, TableState state);
	Task<int> DeleteStaff(int id);
	Task<string> CreateEventsLogFromApi(List<EventsLogResult> data);
	Task<string> CreateEventsLog(CreateEventlogCommand data);
	Task<List<SummaryGroupModel>> CountGroupUserList(DateTime date);
	Task<List<SummaryGroupModel>> CountGroupUserListWithError(DateTime date);
	Task<Dictionary<string,SummaryGroupModel>> CountGroupUserList2(DateTime date);
	Task<bool> FindLoginToDay(string id, DateTime date);
	// Task<int> GetCountInDayN(DateTime date, List<Guid>? ids);
	Task<int> GetCountInDay(DateTime date, List<Guid>? ids);
	// Task UpdateStaff(UpdateStaffModel data, AuditableModel auditable);
}
