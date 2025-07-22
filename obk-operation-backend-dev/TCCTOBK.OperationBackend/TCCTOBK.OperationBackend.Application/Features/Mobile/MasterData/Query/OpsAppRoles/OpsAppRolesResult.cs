using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.OpsAppRoles;

public class OpsAppRolesResult
{
    public Guid Rid { get; set; }
    public int UserType { get; set; }
    public string RoleName { get; set; }
}
