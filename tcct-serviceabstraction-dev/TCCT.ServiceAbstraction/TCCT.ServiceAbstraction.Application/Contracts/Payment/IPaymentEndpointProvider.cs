
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;
using TCCT.ServiceAbstraction.Application.Features.Payment;
using TCCT.ServiceAbstraction.Domain;
namespace TCCT.ServiceAbstraction.Application.Contracts.Payment;

public interface IPaymentEndpointProvider
{
	Task<HttpClient> GetArgentoClientFromFactoryWithBearer(string subCode);
	HttpClient GetClientFromFactory();
	string GetArgentoPaymentTransactionUrl();
	string GetArgentoPaymentSourceUrl();
	string GetArgentoChargePromptPayUrl();
	PaymentConfig GetConfig();
}
