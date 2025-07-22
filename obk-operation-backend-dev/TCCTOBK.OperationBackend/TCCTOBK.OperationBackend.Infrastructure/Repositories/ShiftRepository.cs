using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ShiftRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using static System.Formats.Asn1.AsnWriter;
namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class ShiftRepository : BaseRepository<mtShift>, IShiftRepository
{

	private readonly IClientSiteService _clientSiteService;

	public ShiftRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}
	public async Task<mtShift> GetByName(string name)
	{
		var query = Db.AsTracking();
		var result = await query.FirstOrDefaultAsync(x => x.Name == name);
		if (result == null) throw new NotFoundException("ไม่พบ Shift");
		return result;
	}


	public Task<List<mtShift>> GetAll(string? name)
	{
		var query = GetAllQueryBuilder(name, null);
		return query.ToListAsync();
	}

	public Task<int> GetAllCount(string? shiftName, DateTime? startDate, int? id)
	{
		var query = GetAllQueryBuilder(shiftName, id);
		return query.CountAsync();
	}
	private IQueryable<mtShift> GetAllQueryBuilder(string? name, int? id)
	{
		var query = Db.AsQueryable();
		if (name != null)
		{
			query = query.Where(x => x.Name == name);
		}

		if (id != null)
		{
			query = query.Where(x => x.Id == id);
		}
		return query;
	}

	private IQueryable<mtShift> GetByIdQueryBuilder()
	{
		var query = Db.AsTracking();
		return query;
	}
	public async Task<mtShift> GetById(int id)
	{
		var query = GetByIdQueryBuilder();
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Shift");
		return result;
	}

	public Task<List<mtShift>> Paginate(string? name, TableState state)
	{
		var query = GetAllQueryBuilder(name, null);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	public Task<int> DeleteShift(int id)
	{
		return Db.Where(x => x.Id == id).ExecuteDeleteAsync();
	}

	public async Task<int> CreateShift(CreateShiftModel data, AuditableModel auditable)
	{
		var newShift = new mtShift()
		{
			Name = data.Name,
			StartTime = data.StartTime,
			EndTime = data.EndTime,
			AllowCheckInStart = data.AllowCheckInStart,
			AllowCheckInEnd = data.AllowCheckInEnd,
			CheckoutTimeEnd = data.CheckoutTimeEnd,
			isOverNight = data.IsOverNight,
			CSID = _clientSiteService.ClientSiteId,
		};
		Db.Add(newShift);
		return newShift.Id;
	}

	public async Task UpdateShift(UpdateShiftModel data, AuditableModel auditable)
	{

		var fshift = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == data.Id) ?? throw new NotFoundException("ไม่พบ Shift");
		if (data.Name != null) fshift.Name = data.Name;
		if (data.StartTime != null) fshift.StartTime = (TimeSpan)data.StartTime;
		if (data.EndTime != null) fshift.EndTime = (TimeSpan)data.EndTime;
		if (data.AllowCheckInStart != null) fshift.AllowCheckInStart = (TimeSpan)data.AllowCheckInStart;
		if (data.AllowCheckInEnd != null) fshift.AllowCheckInEnd = (TimeSpan)data.AllowCheckInEnd;
		if (data.CheckoutTimeEnd != null) fshift.CheckoutTimeEnd = (TimeSpan)data.CheckoutTimeEnd;
		if (data.IsOverNight != null) fshift.isOverNight = (int)data.IsOverNight;
		fshift.CSID = _clientSiteService.ClientSiteId;
	}
}
