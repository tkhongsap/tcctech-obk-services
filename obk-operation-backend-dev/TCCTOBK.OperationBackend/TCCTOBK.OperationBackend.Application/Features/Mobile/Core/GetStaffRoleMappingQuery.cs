namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
public class GetStaffRoleMappingQuery
{
	public string StaffCodeOrId { get; set; }

	public GetStaffRoleMappingQuery(string staffCodeOrId)
	{
		StaffCodeOrId = staffCodeOrId;
	}
}
