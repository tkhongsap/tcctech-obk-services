using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidence;
public class AddResidenceCommand : ICommand<AddResidenceResult>
{
	public string UnitNumber { get; set; }
	public string HouseId { get; set; }
	public string Remark { get; set; }
	public bool? Active { get; set; }
	public List<ResidenceAuthFloor> ResidenceAuthFloorArray { get; set; }

	public AddResidenceCommand(string unitNumber, string houseId, string remark, bool? active, List<ResidenceAuthFloor> residenceAuthFloorArray)
	{
		UnitNumber = unitNumber;
		HouseId = houseId;
		Remark = remark;
		ResidenceAuthFloorArray = residenceAuthFloorArray;
		if (active != null) Active = active;
	}
}

public class ResidenceAuthFloor
{
	public List<int> DefaultFloor { get; set; }
	public List<int> SelectFloor { get; set; }
	public int TowerID { get; set; }
}