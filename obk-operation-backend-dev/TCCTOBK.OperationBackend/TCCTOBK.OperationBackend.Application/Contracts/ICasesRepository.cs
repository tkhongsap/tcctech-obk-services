using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpsertCases;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseList;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;

namespace TCCTOBK.OperationBackend.Application;

public interface ICasesRepository
{
    Task<int> UpsertCases(UpsertCasesModel request);
	Task<List<trCases>> GetAll(int? casesId, string? filter, List<int>? idList, int? status, bool scope, TableState state, int? staffId);
	Task<int> GetAllCount(int? casesId, string? filter, List<int>? idList, int? status, bool scope, int? staffId);
	Task<trCases> GetById(int id, bool scope);
	Task<trCases> GetLast();
	Task UpdateSyncStatus(List<int> idList, int updateStatus);
}
