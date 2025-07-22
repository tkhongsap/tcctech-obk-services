using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceAuthorizeFloorMaster;
public class GetDataResidenceAuthorizeFloorMasterCommand : ICommand<List<GetDataResidenceAuthorizeFloorMasterResult>>
{
	public int? ResidenceID { get; set; }


	public GetDataResidenceAuthorizeFloorMasterCommand(int? residenceID)
	{
		ResidenceID = residenceID;
	}
}
