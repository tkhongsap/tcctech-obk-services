using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.OpsAppRoles;

public class OpsAppRolesHandler : IQueryHandler<OpsAppRolesQuery, List<OpsAppRolesResult>>
{
    private readonly IClientSiteService _clientSiteService;
    private readonly IUnitOfWork _uow;

    public OpsAppRolesHandler(IClientSiteService clientSiteService, IUnitOfWork uow)
    {
        _clientSiteService = clientSiteService;
        _uow = uow;
    }
    public async Task<List<OpsAppRolesResult>> Handle(OpsAppRolesQuery request, CancellationToken cancellationToken)
    {
        var state = new TableState();
        var role = await _uow.RoleRepository.GetAll(null, null, Constant.TENANT_OPERATION_APP_ID, state);
        return role.Select(x => new OpsAppRolesResult
        {
            Rid = x.RID,
            UserType = x.RefId,
            RoleName = x.Name
        }).OrderBy(x => x.UserType).ToList();
    }
}
