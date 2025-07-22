using System.Data;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSoc;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSocWithOutActive;

public class GetMemberAndSocWithOutActiveHandler : IQueryHandler<GetMemberAndSocWithOutActiveQuery, GetMemberAndSocWithOutActiveResult>
{
    IUnitOfWork _uow;
    private readonly IClientSiteService _clientSiteService;
    public GetMemberAndSocWithOutActiveHandler(IUnitOfWork uow, IClientSiteService clientSiteService)
    {
        _uow = uow;
        _clientSiteService = clientSiteService;
    }
    public async Task<GetMemberAndSocWithOutActiveResult> Handle(GetMemberAndSocWithOutActiveQuery request, CancellationToken cancellationToken)
    {
        var gmid = new Guid(request.MID);
        var member = await _uow.MemberRepository.GetByIdWithOutCatchWithOutActive(gmid);
        var role = await _uow.RoleRepository.GetByMember(member.MID);
        var roleprivilege = role.Where(x => x.TID == Constant.TENANT_OPERATION_APP_ID && x.CSID == _clientSiteService.ClientSiteId).Select(x => new RolePrivilege()
        {
            RID = x.RID,
            RoleName = x.Name,
            PrivilegeItems = x.trRolePrivilagesItem.Select(a => new PrivilegeItemData()
            {
                PTID = a.PTID,
                Name = a.mtPrivilegeItem.Name,
            }).ToList()
        }).ToList();
        var funcRoleLocation = member.FunctionRoleLocation.Select(x => new FunctionRoleLocations()
        {
            LocationId = x.LocationId,
            FunctionRoleId = x.FunctionRoleId
        }).ToList();
        var clientMember = member.ClientMember.Select(x => new ClientMemberData()
        {
            CSMID = x.CSMID,
            CSID = x.CSID,
            StaffId = x.StaffId,
            DataJson = x.DataJson
        }).FirstOrDefault();
        var res = new GetMemberAndSocWithOutActiveResult()
        {
            MID = member.MID,
            Email = member.Email,
            Roles = roleprivilege,
            Name = member.Name,
            CreatedDate = member.CreatedDate,
            UpdatedDate = member.UpdatedDate,
            UpdatedByName = member.UpdatedByName,
            Status = member.Status,
            FunctionRoleLocation = funcRoleLocation,
            KeyCloakUserId = member.KeyCloakUserId,
            IsLocked = member.IsLocked,
            IsActive = member.IsActive,
            StaffId = clientMember.StaffId
        };
        return res;
    }
}
