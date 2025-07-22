using NPOI.SS.UserModel;
using NPOI.Util;
using NPOI.XSSF.UserModel;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Features.Report.CheckInCheckOut.Query.Model;
using NPOI.SS.Formula.Functions;

namespace TCCTOBK.OperationBackend.Application;

public class GetReportCheckInCheckOutHandler : IQueryHandler<GetReportCheckInCheckOutQuery, GetReportCheckInCheckOutResult>
{
	IMailService _msr;
	IUnitOfWork _uow;
	public GetReportCheckInCheckOutHandler(IMailService msr, IUnitOfWork uow)
	{
		_msr = msr;
		_uow = uow;
	}

	public async Task<GetReportCheckInCheckOutResult> Handle(GetReportCheckInCheckOutQuery request, CancellationToken cancellationToken)
	{
		var dateNow = DateTime.Now;
		string shiftName = request.ShiftName;
		var shiftData = await _uow.ShiftRepository.GetByName(shiftName);
		string shiftDisplay = $"{shiftName} {shiftData.StartTime}-{shiftData.EndTime}";
		if (request.Date != null) dateNow = Convert.ToDateTime(request.Date);
		var dateCheck = dateNow;
		if (shiftData.isOverNight == 1 && request.Date == null){
			dateCheck = dateCheck.AddDays(-1);
		} 

		var dataShift = await _uow.AttendanceRepository.GetAll(shiftName, dateCheck.ToString("yyyy-MM-dd"), null, null, null);
		var items = dataShift.Select(item => new CheckInCheckOutReport
		{
			Date = dateCheck.ToString("yyyy-MM-dd"),
			BaseLocation = item.BaseLocation,
			Company = item.Company,
			Role = item.Role,
			Shift = shiftDisplay,
			UserId = item.UserId,
			FirstName = item.Firstname,
			LastName = item.Lastname,
			CheckInDateTime = item.CheckInDateTime?.AddHours(7).ToString("yyyy-MM-dd HH:mm:ss") ?? "-",
			CheckOutDateTime = item.CheckOutDateTime?.AddHours(7).ToString("yyyy-MM-dd HH:mm:ss") ?? "-",
			LateTime = item.LateTime.ToString()
		}).ToList();


 		List<Attachments> attachments = new List<Attachments>();
		MemoryStream ms = new MemoryStream();
		var newFile = $"checkin-checkout-report-{shiftName}-{dateCheck.ToString("yyyy-MM-dd")}{DateTime.Now.ToString("-HH-mm")}.xlsx";
		using (var fs = new FileStream(newFile, FileMode.Create, FileAccess.Write)){
			IWorkbook workbook = new XSSFWorkbook();
			var fontStyle = workbook.CreateFont();
			fontStyle.IsBold = true;

			var borderStyle = workbook.CreateCellStyle();
			borderStyle.BorderLeft = BorderStyle.Thin;
			borderStyle.BorderRight = BorderStyle.Thin;
			borderStyle.BorderTop = BorderStyle.Thin;
			borderStyle.BorderBottom = BorderStyle.Thin;


			ISheet sheet1 = workbook.CreateSheet("Sheet1");
			var rowIndex = 0;
			rowIndex++;
			string[] headers = { "Date", "Shift", "User ID", "First Name", "Last Name", "Company", "Role", "Base\nLocation", "Check\nIn", "Check\nOut", "Late\nMinutes" };

			IRow row = sheet1.CreateRow(rowIndex);
			for (int i = 0; i < headers.Length; i++)
			{
				var headerCell = row.CreateCell(i);
				headerCell.SetCellValue(headers[i]);
				headerCell.CellStyle = borderStyle;
			}

			foreach (var item in items)
			{
				rowIndex++;
				IRow rowItem = sheet1.CreateRow(rowIndex);

				void SetCellValueAndStyle(int columnIndex, string value)
				{
					var cell = rowItem.CreateCell(columnIndex);
					cell.SetCellValue(value);
					cell.CellStyle = borderStyle;
				}

				SetCellValueAndStyle(0, item.Date);
				SetCellValueAndStyle(1, item.Shift);
				SetCellValueAndStyle(2, item.UserId);
				SetCellValueAndStyle(3, item.FirstName);
				SetCellValueAndStyle(4, item.LastName);
				SetCellValueAndStyle(5, item.Company);
				SetCellValueAndStyle(6, item.Role);
				SetCellValueAndStyle(7, item.BaseLocation);
				SetCellValueAndStyle(8, item.CheckInDateTime!);
				SetCellValueAndStyle(9, item.CheckOutDateTime!);
				SetCellValueAndStyle(10, item.LateTime);
			}
			
			using (var memoryStream = new MemoryStream()) { 
				workbook.Write(memoryStream); 
				attachments.Add(new Attachments{
					FileName = newFile,
					Data = memoryStream.ToArray()
				});
			}
		}

		string formatDate = dateNow.ToString("MM/dd/yyyy");
		var emailbody = $@"
		<h3 style='text-transform: uppercase;2
		font-weight: bold;'>Whom to concern</h3>
		<p style='margin-bottom: 20px;'>This is automatically generated email for Time Attendance Report Date {formatDate}</p>
		<p style='margin-bottom: 20px;'>If need more information, please contact xx-xxx-xxxx (24/7 or NBD)</p>";
				
		var emailList = await _uow.AttendanceRepository.GetConfigEmail();
		var ccEmail = await _uow.AttendanceRepository.GetConfigCCEmail();
		var bodymail = new MailRequest(emailList, "Time Attendance Report (Daily)", emailbody, attachments, ccEmail);
		await _msr.SendEmailAsync(bodymail);
		File.Delete(newFile);
		return new GetReportCheckInCheckOutResult();
	}
}
