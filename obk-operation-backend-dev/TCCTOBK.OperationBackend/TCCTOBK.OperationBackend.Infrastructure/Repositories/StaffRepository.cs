using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using static System.Formats.Asn1.AsnWriter;
namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class StaffRepository : BaseRepository<mtStaff>, IStaffRepository
{

	private readonly IClientSiteService _clientSiteService;

	public StaffRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}
	public async Task<mtStaff> GetByName(string staffName)
	{
		var query = Db.AsTracking();
		var result = await query.FirstOrDefaultAsync(x => x.StaffName == staffName);
		if (result == null) throw new NotFoundException("ไม่พบ Staff");
		return result;
	}

	public async Task<mtStaff> GetByEmail(string email)
	{
		var query = Db.AsTracking();
		var result = await query.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
		// if (result == null) throw new NotFoundException("ไม่พบ Staff");
		return result;
	}

	public async Task<mtStaff> GetByEmailAndSfid(string email, Guid sfid)
	{
		var query = Db.AsTracking();
		var result = await query.FirstOrDefaultAsync(x => x.Email == email && x.Sfid == sfid);
		// if (result == null) throw new NotFoundException("ไม่พบ Staff");
		return result;
	}

	public async Task<mtStaff> GetByEmailOrSfid(string? email, Guid? sfid)
	{
		var query = Db.AsTracking();
		var result = await query.FirstOrDefaultAsync(x => x.Email == email || x.Sfid == sfid);
		// if (result == null) throw new NotFoundException("ไม่พบ Staff");
		return result;
	}



	public Task<List<mtStaff>> GetAll(string? staffName, string? component, bool? mustUseOpsApp)
	{
		var query = GetAllQueryBuilder(staffName, component, mustUseOpsApp, null);
		return query.ToListAsync();
	}

	public Task<List<mtStaff>> GetAllLog()
	{
		var query = Db.AsQueryable();
		query = query.Where(x => x.isDelete == false && x.IsActive == true);
		return query.ToListAsync();
	}


	public Task<List<mtStaff>> GetAllByComponent(string? component)
	{
		var query = Db.AsQueryable();
		query = query.Where(x => x.Component == component);
		return query.ToListAsync();
	}

	public Task<int> GetAllCountByComponent(string? component)
	{
		var query = Db.AsQueryable();
		query = query.Where(x => x.Component == component);
		return query.CountAsync();
	}

	public Task<int> GetAllCount(string? staffName, string? component, bool? mustUseOpsApp, DateTime? startDate, Guid? id)
	{
		var query = GetAllQueryBuilder(staffName, component, mustUseOpsApp, id);
		return query.CountAsync();
	}
	private IQueryable<mtStaff> GetAllQueryBuilder(string? staffName, string? component, bool? mustUseOpsApp, Guid? id)
	{
		var query = Db.AsQueryable();
		query = query.Where(x => x.isDelete == false);
		if (staffName != null)
		{
			query = query.Where(x => x.StaffName.ToLower().Contains(staffName.ToLower()) || x.Email.ToLower().Contains(staffName.ToLower()));
		}

		if (component != null)
		{
			query = query.Where(x => x.Component.Contains(component));
		}

		if (id != null)
		{
			query = query.Where(x => x.Sfid == id);
		}
		if (mustUseOpsApp != null)
		{
			query = query.Where(x => x.MustUseOpsApp == mustUseOpsApp);
		}
		return query;
	}

	private IQueryable<mtStaff> GetByIdQueryBuilder()
	{
		var query = Db.AsTracking();
        query = query.Where(x => x.CSID == _clientSiteService.ClientSiteId);
		query = query.Where(x => x.isDelete == false);
		return query;
	}
	public async Task<mtStaff> GetById(Guid id)
	{
		var query = GetByIdQueryBuilder();
		var result = await query.FirstOrDefaultAsync(x => x.Sfid == id);
		if (result == null) throw new NotFoundException("ไม่พบ Staff");
		return result;
	}

	public Task<List<mtStaff>> Paginate(string? staffName, string? component, bool? mustUseOpsApp, TableState state)
	{
		var query = GetAllQueryBuilder(staffName, component, mustUseOpsApp, null);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
        query = query.OrderByDescending(x => x.CreatedDate).ThenBy(x => x.Seq);
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	public async Task<Guid> SoftDeleteByIdAsync(Guid sfid)
	{
		var fStaff = await Db.AsTracking().FirstOrDefaultAsync(x => x.Sfid == sfid) ?? throw new NotFoundException("ไม่พบ Staff");
		fStaff.isDelete = true;
		fStaff.UpdatedDate = DateTime.UtcNow;

		return sfid;
	}

	public Task<int> DeleteStaff(Guid sfid)
	{
		return Db.Where(x => x.Sfid == sfid).ExecuteDeleteAsync();
	}

	public async Task<Guid> CreateStaff(CreateStaffModel data)
	{

		if (data.Email == null) throw new BadRequestException();
		var newStaff = new mtStaff()
        {
            StaffName = data.StaffName ?? string.Empty,
            Email = data.Email,
            Component = data.Component,
            Position = data.Position,
            Company = data.Company,
            Location = data.Location,
            KeyCloakUserId = data.KeyCloakUserId,
            IsActive = data.IsActive,
            MustUseOpsApp = (bool)data.MustUseOpsApp,
            isDelete = false,
            CreatedDate = data.CreatedDate,
            CreatedBy = data.CreatedBy,
            CreatedByName = data.CreatedByName,
            UpdatedDate = data.UpdatedDate,
            UpdatedBy = data.UpdatedBy,
            UpdatedByName = data.UpdatedByName,
            CSID = _clientSiteService.ClientSiteId,
            Seq = data.Seq
		};
		Db.Add(newStaff);
		return newStaff.Sfid;
	}

    public async Task UpdateStaff(UpdateStaffModel data)
    {

        var fStaff = await Db.AsTracking().FirstOrDefaultAsync(x => x.Sfid == data.Sfid) ?? throw new NotFoundException("ไม่พบ Staff");
        if (data.StaffName != null) fStaff.StaffName = data.StaffName;
        if (data.Email != null) fStaff.Email = data.Email;
        if (data.Component != null) fStaff.Component = data.Component;
        if (data.Position != null) fStaff.Position = data.Position;
        if (data.Company != null) fStaff.Company = data.Company;
        if (data.Location != null) fStaff.Location = data.Location;
        if (data.MustUseOpsApp != null) fStaff.MustUseOpsApp = (bool)data.MustUseOpsApp;
        if (data.isDelete != null) fStaff.isDelete = data.isDelete;
        if (data.KeyCloakUserId != null) fStaff.KeyCloakUserId = data.KeyCloakUserId;
        if (data.IsActive != null) fStaff.IsActive = (bool)data.IsActive;
        fStaff.UpdatedDate = DateTime.UtcNow;
        fStaff.CreatedDate = data.CreatedDate;
        fStaff.CreatedBy = data.CreatedBy;
        fStaff.CreatedByName = data.CreatedByName;
        fStaff.UpdatedDate = data.UpdatedDate;
        fStaff.UpdatedBy = data.UpdatedBy;
        fStaff.UpdatedByName = data.UpdatedByName;
        fStaff.CSID = _clientSiteService.ClientSiteId;
        fStaff.Seq = data.Seq;
    }
}
