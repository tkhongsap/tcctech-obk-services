using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetDataResidenceCardByPersonId;
public class GetDataResidenceCardByPersonIdCommand : ICommand<List<GetDataResidenceCardByPersonIdResult>>
{
	public string PersonID { get; set; }

	public GetDataResidenceCardByPersonIdCommand(string personID)
	{
		PersonID = personID;
	}
}