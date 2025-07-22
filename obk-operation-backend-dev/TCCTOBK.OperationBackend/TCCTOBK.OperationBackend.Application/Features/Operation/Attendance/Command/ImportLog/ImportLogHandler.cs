using MediatR;
using Microsoft.AspNetCore.Http;
using System.Globalization;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AttendanceRepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.Attendance.Model;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Attendance.Command.ImportLog;

public class ImportLogHandler : IRequestHandler<ImportLogCommand, ImportLogResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	IAbstractionService _abstractionService;
	public ImportLogHandler(IUnitOfWork uow, IMailService msr, IAbstractionService ats)
	{
		_uow = uow;
		_msr = msr;
		_abstractionService = ats;
	}

	private async Task<List<Guid>> CheckinProcess(ImportLogCommand request, CancellationToken cancellationToken)
	{
		var shift = await _uow.ShiftRepository.GetByName(request.ShiftName);
		string dateFormat = "yyyy-MM-dd";
		DateTime identifyDate;
		var dateCheck = request.IdentifyDate;
		if (dateCheck == null) {
			identifyDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
			dateCheck = identifyDate.ToString(dateFormat);
		} else {
			DateTime.TryParseExact(dateCheck, dateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out identifyDate);
		}
		DateTime startDate = identifyDate + shift.AllowCheckInStart;
		DateTime endDate = identifyDate + shift.AllowCheckInEnd;
		var type = Constant.INNOFLEX_AUTH_TYPE_FACE;
		var req = new AttendanceLogRequest()
		{
			AuthType = type,
			AuthSuccessType = Constant.INNOFLEX_STATUS_SUCCESS,
			FromDate = startDate.ToString("yyyy-MM-dd HH:mm"),
			ToDate = endDate.ToString("yyyy-MM-dd HH:mm"),
			DeviceKeys = request.DeviceKeys,
		};
		var attendanceLogs = await _abstractionService.InnoflexService.GetAttendanceLog(req);
		List<CreateAttendanceModel> listAttendanceLog = new List<CreateAttendanceModel>();
		var groupedLogs = attendanceLogs.Data.Data.GroupBy(log => log.UserId);
		foreach (var userLog in groupedLogs)
		{
			DateTime checkTime = DateTime.Now;

			foreach (var log in userLog)
			{
				string format = "yyyy-MM-dd hh:mm:ss tt";
				DateTime identifyDateTime;
				DateTime.TryParseExact(log.IdentifyDateTime, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out identifyDateTime);

				if (checkTime > identifyDateTime)
				{
					checkTime = identifyDateTime;
				}
			}


			var createLog = new CreateAttendanceModel()
			{
				Shift = shift.Name,
				UserId = userLog.First().UserId.ToString(),
				Firstname = userLog.First().Firstname ?? "test",
				Lastname = userLog.First().Lastname ?? "test",
				Company = userLog.First().UserCompany ?? "test",
				Role = userLog.First().UserRole ?? "test",
				BaseLocation = userLog.First().UserBaseLocation ?? "test",
				DeviceKey = userLog.First().DeviceKey,
				DeviceName = userLog.First().DeviceName,
				IndentifyType = type,
				IdentifyDate = identifyDate.ToString("yyyy-MM-dd"),
				CheckInDateTime = checkTime.ToUniversalTime(),
				LateTime = shift.StartTime.CompareTo(checkTime.TimeOfDay) < 0 ? (checkTime - shift.StartTime).Minute : 0
			};

			listAttendanceLog.Add(createLog);
		}
		var res = await _uow.AttendanceRepository.BulkCreate(listAttendanceLog, request);
		return res;
	}

	private async Task<List<Guid>> CheckoutProcess(ImportLogCommand request, CancellationToken cancellationToken)
	{
		var shift = await _uow.ShiftRepository.GetByName(request.ShiftName);
		string dateFormat = "yyyy-MM-dd";
		var isOverNight = shift.EndTime < shift.StartTime;
		DateTime identifyDate;
		var dateCheck = request.IdentifyDate;
		if (dateCheck == null) {
			identifyDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
			dateCheck = identifyDate.ToString(dateFormat);
		} else {
			DateTime.TryParseExact(dateCheck, dateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out identifyDate);
		}
		DateTime startDate = identifyDate + shift.EndTime;
		DateTime endDate = identifyDate + shift.CheckoutTimeEnd;
		if (isOverNight)
		{
			startDate = identifyDate.AddDays(1) + shift.EndTime;
			endDate = identifyDate.AddDays(1) + shift.CheckoutTimeEnd;
		}

		var type = Constant.INNOFLEX_AUTH_TYPE_FACE;
		var req = new AttendanceLogRequest()
		{
			AuthType = type,
			AuthSuccessType = Constant.INNOFLEX_STATUS_SUCCESS,
			FromDate = startDate.ToString("yyyy-MM-dd HH:mm"),
			ToDate = endDate.ToString("yyyy-MM-dd HH:mm"),
			DeviceKeys = request.DeviceKeys,
		};
		var attendanceLogs = await _abstractionService.InnoflexService.GetAttendanceLog(req);
		List<UpdateAttendanceModel> listAttendanceLog = new List<UpdateAttendanceModel>();
		var groupedLogs = attendanceLogs.Data.Data.GroupBy(log => log.UserId);
		foreach (var userLog in groupedLogs)
		{
			DateTime checkTime = new DateTime(1, 1, 1);
			foreach (var log in userLog)
			{
				string format = "yyyy-MM-dd hh:mm:ss tt";
				DateTime identifyDateTime;
				DateTime.TryParseExact(log.IdentifyDateTime, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out identifyDateTime);

				if (checkTime < identifyDateTime)
				{
					checkTime = identifyDateTime;
				}
			}

			var updatelog = new UpdateAttendanceModel()
			{
				UserId = userLog.First().UserId.ToString(),
				IdentifyDate = identifyDate.ToString("yyyy-MM-dd"),
				CheckOutDateTime = checkTime.ToUniversalTime()
			};

			listAttendanceLog.Add(updatelog);
		}
		var res = await _uow.AttendanceRepository.BulkUpdate(listAttendanceLog, request);
		return res;
	}

	public async Task<ImportLogResult> Handle(ImportLogCommand request, CancellationToken cancellationToken)
	{
		if (request.AttendanceType == "checkin") {
			await CheckinProcess(request, cancellationToken);
		} else {
			await CheckoutProcess(request, cancellationToken);
		}

		await _uow.SaveChangeAsyncWithCommit();
		return new ImportLogResult();
	}
}

