using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDetailResidenceMemberByPersonID;
public class GetDetailResidenceMemberByPersonIDCommand : ICommand<GetDetailResidenceMemberByPersonIDResult>
{
	public Guid personID { get; set; }
}
