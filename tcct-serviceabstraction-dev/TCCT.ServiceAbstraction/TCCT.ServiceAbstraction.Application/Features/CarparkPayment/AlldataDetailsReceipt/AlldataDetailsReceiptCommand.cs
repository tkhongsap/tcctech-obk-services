using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.AlldataDetailsReceipt;
public class AlldataDetailsReceiptCommand : ICommand<List<AlldataDetailsReceiptResult>>
{
	public string LogId { get; set; }

	public AlldataDetailsReceiptCommand(string logid)
	{
		LogId = logid;
	}
}
