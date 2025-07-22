using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;

namespace TCCTOBK.OperationBackend.Application;

public interface ICaseMediasRepository
{
	Task<Guid> CreateCaseMedias(CreateCaseMediasModel media);
	Task<int> RemoveCaseMedias(int caseId);
}
