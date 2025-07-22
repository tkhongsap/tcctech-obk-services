using CommunityToolkit.HighPerformance.Helpers;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AttendanceRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Repositories;

internal class AttendanceRepository: BaseRepository<trAttendance>, IAttendanceRepository
{

	private readonly IClientSiteService _clientSiteService;

	public AttendanceRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<Guid> Create(CreateAttendanceModel attendance, AuditableModel auditable)
	{
		var newTaskId = Guid.NewGuid();
		var req = new trAttendance()
		{
			Id = newTaskId,
			Shift = attendance.Shift,
			UserId = attendance.UserId,
			Firstname = attendance.Firstname,
			Lastname = attendance.Lastname,
			Company = attendance.Company,
			Role = attendance.Role,
			BaseLocation = attendance.BaseLocation,
			DeviceKey = attendance.DeviceKey,
			DeviceName = attendance.DeviceName,
			IndentifyType = attendance.IndentifyType,
			IdentifyDate = attendance.IdentifyDate,
			CheckInDateTime = attendance.CheckInDateTime,
			CheckOutDateTime = attendance.CheckOutDateTime,
			MetaData = attendance.MetaData,
			LateTime = attendance.LateTime,
			CSID = _clientSiteService.ClientSiteId
		};
		Db.Add(req);
		return newTaskId;
	}

	public async Task<List<Guid>> BulkCreate(List<CreateAttendanceModel> attendances, AuditableModel auditable)
	{
		List<Guid> newLogIds = new List<Guid>();
		foreach (var attendance in attendances)
		{
			attendance.CSID = _clientSiteService.ClientSiteId;
			var res = await Create(attendance, auditable);
			newLogIds.Add(res);
		}

		return newLogIds;
	}

	public async Task<trAttendance?> UpdateById(string userId, string indentifyDate)
	{
		return await Db.AsTracking().FirstOrDefaultAsync(x => x.UserId == userId && x.IdentifyDate == indentifyDate && x.CSID == _clientSiteService.ClientSiteId);
	}

	public async Task<Guid> Update(UpdateAttendanceModel attendance, AuditableModel auditable)
	{
		var m = await UpdateById(attendance.UserId, attendance.IdentifyDate);
		if (m == null) return Guid.Empty;
		m.CheckOutDateTime = attendance.CheckOutDateTime;
		m.CSID = _clientSiteService.ClientSiteId;
		if (attendance.MetaData != null)
		{
			m.MetaData = attendance.MetaData;
		}

		return m.Id;
	}
	public async Task<List<Guid>> BulkUpdate(List<UpdateAttendanceModel> attendances, AuditableModel auditable)
	{
		List<Guid> newLogIds = new List<Guid>();
		foreach (var attendance in attendances)
		{
			attendance.CSID = _clientSiteService.ClientSiteId;
			var res = await Update(attendance, auditable);
			if (res == Guid.Empty) continue;
			newLogIds.Add(res);
		}

		return newLogIds;
	}

	public async Task<List<string>> GetConfigEmail()
	{
		List<string> email = new List<string>();
		if (string.IsNullOrEmpty(DomainConfig.Report.Email)) return email;
		var emailArray = DomainConfig.Report.Email.Split(',');
		email = new List<string>(emailArray);
		return email;
	}

	public async Task<List<string>> GetConfigCCEmail()
	{
		List<string> ccEmail = new List<string>();
		if (string.IsNullOrEmpty(DomainConfig.Report.CCEmail)) return ccEmail;
		var ccEmailArray = DomainConfig.Report.CCEmail.Split(',');
		ccEmail = new List<string>(ccEmailArray);
		return ccEmail;
	}


	public Task<List<trAttendance>> GetAll(string? shiftName, string? day, string? company, string? location, string? role)
	{ 
		var query = GetAllQueryBuilder(shiftName, day, company, location, role);
		return query.ToListAsync();
	}

	public Task<int> GetAllCount(string? shiftName, string? day, string? company, string? location, string? role)
	{
		var query = GetAllQueryBuilder(shiftName, day, company, location, role);
		return query.CountAsync();
	}

	private IQueryable<trAttendance> GetAllQueryBuilder(string? shiftName, string? day, string? company, string? location, string? role)
	{
		var query = Db.AsQueryable();
		if (shiftName != null)
		{
			query = query.Where(x => x.Shift == shiftName);
		}
		if (day != null)
		{
			query = query.Where(x => x.IdentifyDate == day);
		}
		if (company != null)
		{
			query = query.Where(x => x.Company == company);
		}
		if (location != null)
		{
			query = query.Where(x => x.BaseLocation == location);
		}
		if (role != null)
		{
			query = query.Where(x => x.Role == role);
		}

		query = query.OrderBy(x => x.CheckInDateTime);

		return query;
	}
}
