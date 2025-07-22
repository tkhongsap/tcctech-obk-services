using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;

namespace TCCTOBK.OperationBackend.Application;

public interface IPPMRepository
{
    Task<int> UpsertPPM(PPMUpdatesResult request);
	Task<List<trPPMs>> GetAll(int? ppmId, string? filter, List<int>? idList, int? status, bool? isPPMList, string? userId, int? roleId, TableState state);
	Task<int> GetAllCount(int? ppmId, string? filter, List<int>? idList, int? status, bool? isPPMList, string? userId, int? roleId);
	Task<trPPMs> GetById(int id, bool scope, List<int>? statusList, bool? isThrow = true);
	Task<trPPMs> GetLast();
}
