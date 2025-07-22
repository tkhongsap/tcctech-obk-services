using System.Text.Json;
using NPOI.OpenXmlFormats.Dml;
using NPOI.OpenXmlFormats.Dml.Picture;
using NPOI.OpenXmlFormats.Dml.WordProcessing;
using NPOI.OpenXmlFormats.Wordprocessing;
using NPOI.XWPF.UserModel;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;
using System;
using System.Drawing;
using System.IO;

namespace TCCTOBK.OperationBackend.Application;

public class TaskDetailReportHandler : IQueryHandler<TaskDetailReportQuery, TaskDetailReportResult>
{
	IMailService _msr;
	IUnitOfWork _uow;
	private CT_R _run;
	IMinioService _minioService;
	public TaskDetailReportHandler(IMailService msr, IUnitOfWork uow, IMinioService minioService)
	{
		_msr = msr;
		_uow = uow;
		_minioService = minioService;
	}

	public async Task<TaskDetailReportResult> Handle(TaskDetailReportQuery request, CancellationToken cancellationToken)
	{
		var gtid = new Guid(request.TID);
		var task = await _uow.TaskRepository.GetById(gtid, true);
		var daterTimeRouteString = task.StartDate?.ToString("yyyyMMdd-HHmm") ?? "";

		var guardtourStatus = new string[] { "Assign", "InProgress", "Completed", "Skip", "Complete", "In-Complete", "Cancel" };
		var actionConfirm = new string[] { "N/A", "N/A", "Done", "Skip", "N/A", "Not Done" };
		var locationName = task.LocationId.ToString();
		var newFile = $"guardtour-report-{daterTimeRouteString}-{task.Name}.docx";
		var name = "";
		try
		{
			var member = await _uow.MemberRepository.GetById(task.MemberId);
			name = member.FirstName + " " + member.LastName;
		}
		catch (NotFoundException e)
		{
			name = task.MemberId.ToString();
		}

		string? locationSubtask = null;
		if (task.location != null && task.location.BuildingZoneName != null)
		{
			locationName = $"{task.location.BuildingZoneName}";
			locationSubtask = task.location.BuildingZoneName;
		}

		var completeDateTime = task.CompleteDate?.AddHours(7);


		var res = new GetTaskResultReport()
		{
			Id = task.Id,
			Name = task.Name,
			Member = name.Trim(),
			LocationName = locationName,
			Status = task.StatusId,
			StartDate = task.StartDate?.ToString("ddd, MMM dd yyyy") ?? "",
			StartTime = task.StartDate?.ToString("HH:mm") ?? "",
			EndDate = task.EndDate?.ToString("ddd, MMM dd yyyy") ?? "",
			EndTime = task.EndDate?.ToString("HH:mm") ?? "",
			AcknowleageBeforeMinutes = DomainConfig.CMSAPI.AcknowleageBeforeMinutes,
			CompleteDate = completeDateTime?.ToString("ddd, MMM dd yyyy") ?? "",
			CompleteTime = completeDateTime?.ToString("HH:mm") ?? "",
			Duration = completeDateTime?.Subtract(task.StartDate ?? DateTime.Now.ToUniversalTime().AddHours(7)).ToString("hh\\:mm") ?? "",
			AcknowleageDateTime = task.AcknowledgeDate?.AddHours(7).ToString("ddd, MMM dd yyyy HH:mm") ?? "",
			CancelReason = task.CancelReason
		};

		var countDidSubtask = 0;
		var subtasks = new List<trSubtask>();
		var taskSubtaskOrder = task.trTaskSubtask
			.OrderBy(taskSubtask => taskSubtask.trSubtask.StatusId == Constant.GUARD_TOUR_STATUS_ASSIGNED || taskSubtask.trSubtask.StatusId == Constant.GUARD_TOUR_STATUS_INPROGRESS ? 0 : 1)
			.ThenBy(taskSubtask => taskSubtask.Seq)
			.ToList();
		foreach (var subtask in taskSubtaskOrder)
		{
			if (subtask.trSubtask.StatusId != Constant.GUARD_TOUR_STATUS_ASSIGNED && subtask.trSubtask.StatusId != Constant.GUARD_TOUR_STATUS_INPROGRESS) countDidSubtask++;
			subtasks.Add(subtask.trSubtask);
		}
		var sth = new GetSubtaskQueryHandler(_uow, _minioService);
		var count = task.trTaskSubtask.Count;
		var mapSubtask = await sth.MapSubtask(subtasks, locationSubtask, true);
		res.Subtasks = new SubtaskData()
		{
			TotalRecords = count,
			TotalDidRecords = $"{countDidSubtask}/{count}",
			ProgressSuccess = mapSubtask.Item1 / 100,
			ProgressSuccessText = mapSubtask.Item1.ToString() + "%",
			ProgressFail = mapSubtask.Item2,
			Data = mapSubtask.Item3
		};

		List<Attachments> attachments = new List<Attachments>();
		var ms = new MemoryStream();
		using (ms)
		{
			var document = new XWPFDocument();
			var p0 = document.CreateParagraph();
			XWPFRun r0 = p0.CreateRun();
			r0.FontSize = 20;
			r0.IsBold = true;
			r0.SetText("Task Report");

			var tableTask = document.CreateTable(12, 2);
			SetTableStyle(tableTask, 1, 5000, 3000, 5000);

			// Table head
			var rowIndexTask = 0;
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Reference Number:", res.Id.ToString());
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Title:", res.Name);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Assigned officer:", res.Member);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Status:", guardtourStatus[res.Status]);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Subtask completed:", res.Subtasks.TotalDidRecords);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Location:", res.LocationName);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Acknowledge at:", res.AcknowleageDateTime);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Started at:", res.StartDate + " " + res.StartTime);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Expected Completed at:", res.EndDate + " " + res.EndTime);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Actual Completed at:", res.CompleteDate + " " + res.CompleteTime);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Duration:", res.Duration);
			CreateRowAndSetValue(tableTask, rowIndexTask++, "Cancel Reason:", res.CancelReason ?? "-");
			var p2 = document.CreateParagraph();

			var rowIndex = 0;
			string[] headers = { "S/N", "Subtask", "Completed\nat", "Status" };
			var table = document.CreateTable(1, headers.Length);
			SetTableStyle(table, 3, 2000, 2000, 5000);

			var row = table.GetRow(rowIndex);
			for (int i = 0; i < headers.Length; i++)
			{
				var headerCell = row.GetCell(i);
				headerCell.SetText(headers[i]);
			}

			foreach (var item in res.Subtasks.Data)
			{
				rowIndex++;
				var tableSubTask = document.CreateTable(1, headers.Length);
				var rowSubtask = tableSubTask.GetRow(0);
				void SetCellValueAndStyle(int columnIndex, string value)
				{
					var cell = rowSubtask.GetCell(columnIndex);
					cell.SetText(value);
				}
				SetTableStyle(tableSubTask, 3, 2000, 2000, 5000);

				DateTime.TryParse(item.UpdatedDate, out DateTime updatedDate);

				SetCellValueAndStyle(0, rowIndex.ToString());
				SetCellValueAndStyle(1, item.Name);
				SetCellValueAndStyle(2, updatedDate.AddHours(7).ToString("dd/MM/yyyy HH:mm:ss") ?? "-");
				SetCellValueAndStyle(3, guardtourStatus[item.Status]);

				var tableAction = document.CreateTable(item.Action.Count, 2);
				var rowIndexAction = 0;
				SetTableStyle(tableAction, 1, 1000, 5000, 8000);

				foreach (var itemAction in item.Action)
				{
					if (itemAction.ActionType.ToLower() == "complex" && itemAction.MetaData != null && (itemAction.MetaData.Photos.Count > 0 || itemAction.MetaData.Videos.Count > 0 || itemAction.MetaData.Files.Count > 0 || itemAction.MetaData.PhotoList.Count > 0))
					{
						CreateRowAndSetValue(tableAction, rowIndexAction++, itemAction.Name, "");
						var countPhotos = itemAction.MetaData.Photos.Count > 0 ? itemAction.MetaData.Photos.Count : 0;
						var countPhotosList = itemAction.MetaData.PhotoList.Count > 0 ? itemAction.MetaData.PhotoList.Count : 0;
						var tableActionMeta = document.CreateTable(countPhotos + itemAction.MetaData.Videos.Count + itemAction.MetaData.Files.Count + countPhotosList + 1, 2);
						var rowIndexActionMeta = 0;
						SetTableStyle(tableActionMeta, 1, 1000, 5000, 8000);
						if (itemAction.MetaData != null && itemAction.MetaData.Videos.Count > 0)
						{
							var rowActionMeta = tableActionMeta.GetRow(rowIndexActionMeta);
							var cellMeta = rowActionMeta.GetCell(0);
							cellMeta.SetText("Videos");
							for (int i = 0; i < itemAction.MetaData.Videos.Count; i++)
							{
								CreateRowAndSetValue(tableActionMeta, rowIndexActionMeta++, "", itemAction.MetaData.Videos[i]);
							}
						}

						if (itemAction.MetaData != null && itemAction.MetaData.Files.Count > 0)
						{
							var rowActionMeta = tableActionMeta.GetRow(rowIndexActionMeta);
							var cellMeta = rowActionMeta.GetCell(0);
							cellMeta.SetText("Files");
							for (int i = 0; i < itemAction.MetaData.Files.Count; i++)
							{
								CreateRowAndSetValue(tableActionMeta, rowIndexActionMeta++, "", itemAction.MetaData.Files[i]);
							}
						}

						if (itemAction.MetaData != null && itemAction.MetaData.Photos.Count > 0)
						{
							for (int i = 0; i < itemAction.MetaData.Photos.Count; i++)
							{
								var rowActionMeta = tableActionMeta.GetRow(rowIndexActionMeta);
								var cellMeta = rowActionMeta.GetCell(0);
								cellMeta.SetText("Photos");
								var cellMetaData = rowActionMeta.GetCell(1);
								var cellMetaDataParagraph = cellMetaData.AddParagraph();
								using (var httpClient = new HttpClient())
								{
									httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");
									var response = await httpClient.GetAsync(itemAction.MetaData.Photos[i]);
									var keyImage = $"image{item.Id}{itemAction.ActionId}{i}";
									response.EnsureSuccessStatusCode();
									var pictureDataResponse = await response.Content.ReadAsByteArrayAsync();
									var picDataResize = new MemoryStream(ResizeImage(pictureDataResponse, 150, 100));

									using (var fileStream = new FileStream(keyImage, FileMode.Create, FileAccess.Write))
									{
										await picDataResize.CopyToAsync(fileStream);
									}
									var widthEmus = (int)(150.0 * 9525);
									var heightEmus = (int)(100.0 * 9525);
									var cellMetaDataParagraphRun = cellMetaDataParagraph.CreateRun();
									using (FileStream picData = new FileStream(keyImage, FileMode.Open))
									{
										cellMetaDataParagraphRun.AddPicture(picData, (int)PictureType.JPEG, keyImage, widthEmus, heightEmus);
										if (i == 0)
										{
											var docPr = ((NPOI.OpenXmlFormats.Dml.WordProcessing.CT_Drawing)cellMetaDataParagraphRun.GetCTR().Items[0]).inline[0].docPr;
											docPr.id = 1000;
										}
									}

									cellMetaDataParagraphRun.AppendText(" ");

									File.Delete(keyImage);
								}
								rowIndexActionMeta++;
							}
						}

						if (itemAction.MetaData?.PhotoList?.Count > 0)
						{
							using var httpClient = new HttpClient();
							httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");

							foreach (var (photo, index) in itemAction.MetaData.PhotoList.Select((photo, index) => (photo, index)))
							{
								var rowActionMeta = tableActionMeta.GetRow(rowIndexActionMeta);
								var cellMeta = rowActionMeta.GetCell(0);
								cellMeta.SetText("Photos");
								var cellMetaData = rowActionMeta.GetCell(1);
								var cellMetaDataParagraph = cellMetaData.AddParagraph();

								try
								{
									using var response = await httpClient.GetAsync(photo.Path);
									response.EnsureSuccessStatusCode();
									var pictureDataResponse = await response.Content.ReadAsByteArrayAsync();
									using var resizedImageStream = new MemoryStream(ResizeImage(pictureDataResponse, 200, 150));

									var widthEmus = 200 * 9525;
									var heightEmus = 150 * 9525;
									var cellMetaDataParagraphRun = cellMetaDataParagraph.CreateRun();

									cellMetaDataParagraphRun.AddPicture(resizedImageStream, (int)PictureType.JPEG, $"image_{item.Id}_{itemAction.ActionId}_{index}", widthEmus, heightEmus);
									
									if (index == 0)
									{
										var docPr = ((NPOI.OpenXmlFormats.Dml.WordProcessing.CT_Drawing)cellMetaDataParagraphRun.GetCTR().Items[0]).inline[0].docPr;
										docPr.id = 1000;
									}

									var datePhoto = string.IsNullOrEmpty(photo.Date) ? "-" : photo.Date;
									cellMetaDataParagraphRun.AppendText($" {datePhoto} ");
								}
								catch (Exception e)
								{
									Console.WriteLine($"Error processing image {photo.Path}: {e.Message}");
								}

								rowIndexActionMeta++;
							}
						}
						var rowActionMetaRemarks = tableActionMeta.GetRow(rowIndexActionMeta);
                        var cellMetaRemarks = rowActionMetaRemarks.GetCell(0);
                        cellMetaRemarks.SetText("Remarks");
                        CreateRowAndSetValue(tableActionMeta, rowIndexActionMeta++, "", itemAction.Remarks ?? "-");
					}

					else if (itemAction.ActionType.ToLower() == "complex")
					{
						CreateRowAndSetValue(tableAction, rowIndexAction++, itemAction.Name, "N/A");
					}
					else if (itemAction.ActionType.ToLower() == "confirm" || itemAction.ActionType.ToLower() == "qr")
					{
						CreateRowAndSetValue(tableAction, rowIndexAction++, itemAction.Name, actionConfirm[itemAction.Status]);
					}
				}
			}

			document.Write(ms);
		}

		var base64 = Convert.ToBase64String(ms.ToArray());
		var fileName = await putGetObjectUrl(newFile, base64);
		return new TaskDetailReportResult()
		{
			Path = fileName
		};
	}

	public byte[] ConvertFileStreamToByteArray(FileStream fileStream)
	{
		using (var memoryStream = new MemoryStream())
		{
			fileStream.CopyTo(memoryStream);
			return memoryStream.ToArray();
		}
	}

	private static void SetTableStyle(XWPFTable table, int columnCount, ulong width, ulong widthFirst, ulong widthSecond)
	{
		table.SetCellMargins(10, 0, 0, 0);
		table.SetTopBorder(XWPFTable.XWPFBorderType.THICK, 1, 1, "#000000");
		table.SetBottomBorder(XWPFTable.XWPFBorderType.THICK, 1, 1, "#000000");
		table.SetLeftBorder(XWPFTable.XWPFBorderType.THICK, 1, 1, "#000000");
		table.SetRightBorder(XWPFTable.XWPFBorderType.THICK, 1, 1, "#000000");
		table.SetInsideHBorder(XWPFTable.XWPFBorderType.THICK, 1, 1, "#000000");
		table.SetInsideVBorder(XWPFTable.XWPFBorderType.THICK, 1, 1, "#000000");

		for (int i = 0; i <= columnCount; i++)
		{
			if (i == 0)
			{
				table.SetColumnWidth(i, widthFirst);
			}
			else if (i == 1)
			{
				table.SetColumnWidth(i, widthSecond);
			}
			else
			{
				table.SetColumnWidth(i, width);
			}
		}
	}

	private static void CreateRowAndSetValue(XWPFTable sheet, int rowIndex, string value, string formattedValue)
	{
		var row = sheet.GetRow(rowIndex);
		var cell = row.GetCell(0);
		cell.SetText(value);

		var cell1 = row.GetCell(1);
		cell1.SetText(formattedValue);
	}

	private async Task<string> putGetObjectUrl(string itemMeta, string base64)
	{
		var buckerName = DomainConfig.Minio.BucketName;
		var pathName = DomainConfig.Minio.BucketGuardtourName;
		var objectName = $"{itemMeta}";
		if (pathName != null && pathName != "")
		{
			objectName = $"{pathName}/{itemMeta}";
		}

		await _minioService.PutObject(buckerName, base64, objectName);
		return await _minioService.GetObject(buckerName, objectName);
	}

	public byte[] ResizeImage(byte[] fileBuffer, int newWidth, int newHeight)
	{
		using (var inputStream = new MemoryStream(fileBuffer))
		using (var originalImage = Image.FromStream(inputStream))
		{
			var resizedImage = new Bitmap(newWidth, newHeight);
			using (var graphics = Graphics.FromImage(resizedImage))
			{
				graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBilinear;
				graphics.DrawImage(originalImage, 0, 0, newWidth, newHeight);
			}

			using (var memoryStream = new MemoryStream())
			{
				resizedImage.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
				return memoryStream.ToArray();
			}
		}
	}
}