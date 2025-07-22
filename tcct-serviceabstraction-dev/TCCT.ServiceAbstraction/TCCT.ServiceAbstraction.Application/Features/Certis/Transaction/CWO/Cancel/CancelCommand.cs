using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Cancel;
public class CancelCommand : ICommand<CancelResult>
{
	public string cancelledBy { get; set; } = null!;
	public string cancelledComment { get; set; } = null!;
}
