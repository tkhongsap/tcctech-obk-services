
namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
public interface ICertisTransactionService
{
	ICertisTransactionCWOService CWOService { get; }
	ICertisTransactionDMSService DMSService { get; }
	ICertisTransactionPPMService PPMService { get; }
	ICertisTransactionCMSService CMSService { get; }
	ICertisTransactionCoreService CoreService { get; }
	ICertisTransactionWFMService WFMService { get; }
	ICertisTransactionIFMService IFMService { get; }
}
