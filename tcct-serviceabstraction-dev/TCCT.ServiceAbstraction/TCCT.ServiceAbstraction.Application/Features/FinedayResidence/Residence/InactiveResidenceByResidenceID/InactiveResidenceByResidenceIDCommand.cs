using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.InactiveResidenceByResidenceID;
public class InactiveResidenceByResidenceIDCommand : ICommand<InactiveResidenceByResidenceIDResult>
{
	public int residenceID { get; set; }
}
