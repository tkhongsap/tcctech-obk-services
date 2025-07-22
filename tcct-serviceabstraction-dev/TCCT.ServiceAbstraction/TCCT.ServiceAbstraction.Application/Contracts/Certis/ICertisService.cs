using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis;
public interface ICertisService
{
	ICertisMasterDataService MasterData { get; }
	ICertisTransactionService Transaction { get; }
}
