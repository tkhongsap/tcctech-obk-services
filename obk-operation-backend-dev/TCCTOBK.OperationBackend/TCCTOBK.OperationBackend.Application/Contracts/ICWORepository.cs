using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Command.UpsertCWO;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CWORepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Model;

namespace TCCTOBK.OperationBackend.Application;

public interface ICWORepository
{
    Task<int> UpsertCWO(CWOUpdatesResult request);
	Task<List<trCWOs>> GetAll(int? cwoId, string? filter, List<int>? idList, int? syncStatus, bool scope, string? userId, int? roleId, bool? isSOC, int? status, bool? isCWOList, TableState state);
	Task<int> GetAllCount(int? cwoId, string? filter, List<int>? idList, int? syncStatus, bool scope, string? userId, int? roleId, bool? isSOC, int? status, bool? isCWOList);
	Task<trCWOs> GetById(int id, bool scope, bool? isThrow = true);
	Task<trCWOs> GetLast();
	Task UpdateSyncStatus(List<int> idList, int updateStatus);
}
