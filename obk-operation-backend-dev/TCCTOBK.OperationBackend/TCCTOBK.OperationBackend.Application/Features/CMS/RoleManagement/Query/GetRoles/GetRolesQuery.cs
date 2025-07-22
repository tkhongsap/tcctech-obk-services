using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRoles;

public class GetRolesQuery : TableState, IQuery<GetRolesResult>
{
    public string? Filter { get; set; }
    public List<Guid>? Privilges { get; set; }

	//public GetRolesQuery(string? filter, List<Guid>? privilgeid, int skip, int take)
    //{
    //	Filter = filter;
    //	Privilges = privilgeid;
    //	Skip = skip;
    //	Take = take;
    //}
}
