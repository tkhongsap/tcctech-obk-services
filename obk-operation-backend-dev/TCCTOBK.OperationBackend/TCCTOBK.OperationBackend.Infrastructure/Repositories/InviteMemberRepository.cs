using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Repositories;
public class InviteMemberRepository : BaseRepository<trInviteMember>, IInviteMemberRepository
{
	private readonly IClientSiteService _clientSiteService;

	public InviteMemberRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<string> Create(Guid mid, AuditableModel auditable)
	{
		var invitemember = await Db.AsTracking().FirstOrDefaultAsync(x => x.IsActive && x.MID == mid);
		if (invitemember != null)
		{
			invitemember.IsActive = false;
		}
		//var member = await Context.Member.FirstOrDefaultAsync(x => x.MID == mid && x.Status == Constant.MEMBERSTATUS_PENDING);
		var newinvitemember = new trInviteMember()
		{
			IMID = Guid.NewGuid(),
			MID = mid,
			InviteCode = Guid.NewGuid().ToString(),
			IsActive = true,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
			CSID = _clientSiteService.ClientSiteId
			//taMember = member!
		};
		await Db.AddAsync(newinvitemember);
		return newinvitemember.InviteCode;
	}

	public async Task<Guid?> Get(Guid mid, string invitecode)
	{
		var getinvitemember = await Db.FirstOrDefaultAsync(x => x.IsActive == true && x.InviteCode == invitecode && x.MID == mid);
		return getinvitemember?.IMID;
	}
	public async Task UpdateStatus(string invitecode)
	{
		var invitemember = await Db.AsTracking().FirstOrDefaultAsync(x => x.IsActive && x.InviteCode == invitecode);
		if (invitemember != null)
		{
			invitemember.IsActive = false;
			invitemember.CSID = _clientSiteService.ClientSiteId;
		}
	}

	public async Task UpdateStatusMID(Guid mid)
	{
		var invitemember = await Db.AsTracking().FirstOrDefaultAsync(x => x.MID == mid);
		if (invitemember != null)
		{
			invitemember.IsActive = false;
			invitemember.CSID = _clientSiteService.ClientSiteId;
		}
	}

}
