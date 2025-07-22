using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class ResetPasswordRepository : BaseRepository<trResetPassword>, IResetPasswordRepository
{
	public ResetPasswordRepository(ITCCTOBKContext context) : base(context)
	{

	}

	public async Task<bool> CloseAllMember(Guid mid)
	{
		var data = await Db.AsTracking().Where(x => x.MID == mid).ToListAsync();
		if (data.Count() == 0) return true;
		foreach (var item in data)
		{
			item.IsActive = false;
		}
		return true;
	}

	public async Task<string> Create(Guid mid, taMember member)
	{
		var rpid = Guid.NewGuid();
		var data = new trResetPassword()
		{
			MID = mid,
			RPID = rpid,
			ResetPasswordCode = Guid.NewGuid().ToString(),
			IsActive = true,
			CreatedBy = new Guid(),
			CreatedByName = "System",
			CreatedDate = DateTime.Now,
			UpdatedBy = new Guid(),
			UpdatedByName = "System",
			UpdatedDate = DateTime.Now,
		};
		await Db.AddAsync(data);
		return data.ResetPasswordCode;
	}

	public async Task<trResetPassword?> Get(string resetpasswordcode)
	{
		return await Db.FirstOrDefaultAsync(x => x.ResetPasswordCode == resetpasswordcode && x.IsActive);
	}

	public async Task<List<trResetPassword>> GetList(Guid mid)
	{
		return await Db.Where(x => x.MID == mid).ToListAsync();
	}

	public async Task<bool> UpdateStatus(Guid mid, string resetpasswordcode)
	{
		try
		{
			var data = await Db.AsTracking().FirstOrDefaultAsync(x => x.MID == mid && x.ResetPasswordCode == resetpasswordcode && x.IsActive);
			if (data == null) return false;
			data.IsActive = false;
			return true;
		}
		catch
		{
			return false;
		}
	}
}
