using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public interface ICaseTasksRepository
{
	Task<int> CreateCaseTasks(CaseIncidentTaskItem tasks);
	Task<int> RemoveCaseTasks(int caseId);
	Task<List<trCaseTasks>> GetAll(int? id, string? filter, List<int>? idList, int? status, bool scope, TableState state, int? assignedStaffId, int? locationId, int? priorityLevelId, int? caseStatusCode, int? caseId);
	Task<int> GetAllCount(int? id, string? filter, List<int>? idList, int? status, bool scope, int? assignedStaffId, int? locationId, int? priorityLevelId, int? caseStatusCode, int? caseId);
	Task<trCaseTasks> GetById(int id, bool scope);
	Task<trCaseTasks> UpdateById(int id);
	Task<int> UpdateCaseTasks(CaseIncidentTaskItem task);
	Task<int> RemoveCaseTasksByIds(List<int> idList);
	Task<bool> UpdateTaskStatus(int id, int status);
}
