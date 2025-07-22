using System.Globalization;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpsertShiftManPowerCommand;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using static System.Formats.Asn1.AsnWriter;
namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class ShiftManPowerRequestRepository : BaseRepository<mtShiftManPowerRequest>, IShiftManPowerRequestRepository
{

	private readonly IClientSiteService _clientSiteService;

	public ShiftManPowerRequestRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public Task<List<mtShiftManPowerRequest>> GetAll(string? shiftName, DateTime? dateCheck)
	{
		var query = GetAllQueryBuilder(shiftName, dateCheck, null);
		return query.ToListAsync();
	}

	private IQueryable<mtShiftManPowerRequest> GetAllQueryBuilder(string? shiftName, DateTime? dateCheck, int? id)
	{
		var query = Db.AsQueryable();
		if (shiftName != null)
		{
			query = query.Where(x => x.Shift == shiftName);
		}
		if (dateCheck != null)
		{
			query = query.Where(x => x.StartDateTime <= dateCheck && (x.EndDateTime == null || x.EndDateTime >= dateCheck));
		}
		if (id != null)
		{
			query = query.Where(x => x.Id == id);
		}
		return query;
	}

	public Task<int> GetAllCount(string? shiftName, DateTime? dateCheck, int? id)
	{
		var query = GetAllQueryBuilder(shiftName, dateCheck, id);
		return query.CountAsync();
	}

	public Task<List<mtShiftManPowerRequest>> Paginate(string? shiftName, DateTime? dateCheck, TableState state)
	{
		var query = GetAllQueryBuilder(shiftName, dateCheck, null);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	public async Task<mtShiftManPowerRequest> GetById(int id)
	{
		var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Shift นี้");
		return result;
	}


	public async Task<int> CreateShiftManPower(UpsertShiftManPowerCommandCommand smp, AuditableModel auditable)
	{
		if (smp.Shift == null || smp.BaseLocation == null || smp.Company == null || smp.Role == null || smp.StartDateTime == null) throw new BadRequestException();
		var newAP = new mtShiftManPowerRequest()
		{
			Shift = smp.Shift,
			BaseLocation = smp.BaseLocation,
			Company = smp.Company,
			Role = smp.Role,
			Demand = smp.Demand ?? 0,
			StartDateTime = smp.StartDateTime,
			EndDateTime = smp.EndDateTime,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
			CSID = _clientSiteService.ClientSiteId
		};
		Db.Add(newAP);
		return newAP.Id;
	}

	public async Task UpdateShiftManPower(UpsertShiftManPowerCommandCommand smp, AuditableModel auditable)
	{
		var updatesmp = await Db.AsTracking().Where(x => x.Id == smp.Id).FirstAsync();
		if (smp.Shift != null) updatesmp.Shift = smp.Shift;
		if (smp.BaseLocation != null) updatesmp.BaseLocation = smp.BaseLocation;
		if (smp.Company != null) updatesmp.Company = smp.Company;
		if (smp.Role != null) updatesmp.Role = smp.Role;
		if (smp.Demand != null) updatesmp.Demand = smp.Demand ?? 0;
		if (smp.StartDateTime != null) updatesmp.StartDateTime = smp.StartDateTime;
		if (smp.EndDateTime != null) updatesmp.EndDateTime = smp.EndDateTime;
		updatesmp.UpdatedBy = auditable.UpdatedBy;
		updatesmp.UpdatedByName = auditable.UpdatedByName!;
		updatesmp.UpdatedDate = auditable.UpdatedDate;
		updatesmp.CSID = _clientSiteService.ClientSiteId;
		Db.Update(updatesmp);
	}

	public Task<int> DeleteShiftManPower(int id)
	{
		return Db.Where(x => x.Id == id && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}


}
