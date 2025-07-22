using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Contracts.API;
public interface IAbstractionService
{
	IUserService UserService { get; }
	IAbstractionOperationService Operation { get; }
	IAbstractionCertisTransactionService CertisTransaction { get; }
	IMasterData MasterData { get; }
	IAbstractionInnoflexService InnoflexService { get; }
}
