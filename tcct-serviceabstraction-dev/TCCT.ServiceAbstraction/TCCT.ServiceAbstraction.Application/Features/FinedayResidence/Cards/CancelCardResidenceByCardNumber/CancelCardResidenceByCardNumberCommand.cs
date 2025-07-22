using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.CancelCardResidenceByCardNumber;
public class CancelCardResidenceByCardNumberCommand : ICommand<CancelCardResidenceByCardNumberResult>
{
	public string CardNumber { get; set; }

	public CancelCardResidenceByCardNumberCommand(string cardNumber)
	{
		CardNumber = cardNumber;
	}
}