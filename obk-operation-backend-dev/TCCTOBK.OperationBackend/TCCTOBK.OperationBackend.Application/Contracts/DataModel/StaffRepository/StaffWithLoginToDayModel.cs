
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;

public class StaffWithLoginToDayModel : mtStaff
{
	public bool? LoginToDay { get; set; }
}
