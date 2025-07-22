using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;
public class GetStaffRoleMappingQuery : IQuery<List<GetStaffRoleMappingResult>>
{
	public string StaffCodeOrId { get; set; }

	public GetStaffRoleMappingQuery(string staffCodeOrId)
	{
		StaffCodeOrId = staffCodeOrId;
	}
}
