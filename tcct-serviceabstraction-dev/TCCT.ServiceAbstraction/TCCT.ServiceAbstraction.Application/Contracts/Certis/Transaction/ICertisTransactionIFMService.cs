using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.IFM.CWOsbyincidentId;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
public interface ICertisTransactionIFMService
{
	Task<List<CWOsbyincidentIdResult>> CWOsbyincidentId(int id);
}
