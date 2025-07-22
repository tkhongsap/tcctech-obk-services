using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
using System.Text.RegularExpressions;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class SubtaskActionRepository : BaseRepository<trSubtaskAction>, ISubtaskActionRepository
{
	private readonly IMinioService _minioservice;
	public SubtaskActionRepository(ITCCTOBKContext context, IMinioService minioservice) : base(context)
	{
		_minioservice = minioservice;
	}

	public async Task<trSubtaskAction> GetById(Guid? aid, Guid? stid, string? qrId, bool scope)
	{
		var query = GetByIdQueryBuilder(aid, stid, scope);
		var result = await query.FirstOrDefaultAsync();
		if (result == null) throw new NotFoundException("ไม่พบ Subtask Action");
		if (result.trAction.MetaData != null)
		{
			var listSubtaskActionMataData = JsonConvert.DeserializeObject<GuardTourActionMetaDataResult>(result.trAction.MetaData!);
			if ((listSubtaskActionMataData != null && listSubtaskActionMataData.QrId != null && qrId == null) || (listSubtaskActionMataData != null && qrId != null && listSubtaskActionMataData.QrId != qrId)) throw new NotFoundException("QR ไม่ถูกต้อง");
		}

		return result;
	}

	private IQueryable<trSubtaskAction> GetByIdQueryBuilder(Guid? aid, Guid? stid, bool scope)
	{
		var query = Db.AsQueryable();
		if (aid != null) query = query.Where(x => x.Action == aid);
		if (stid != null) query = query.Where(x => x.Subtask == stid);
		if (scope == true)
		{
			query = query.Include(x => x.trAction).ThenInclude(x => x.mtActionType);
		}
		return query;
	}

	public async Task UpdateSubtaskAction(UpdateSubtaskActionModel updateData, AuditableModel auditable)
	{
		var checkQr = await GetById(updateData.AID, updateData.STID, updateData.QrId, true);
		var fSubtaskAction = await Db.AsTracking().FirstOrDefaultAsync(x => x.Action == updateData.AID && x.Subtask == updateData.STID) ?? throw new NotFoundException("ไม่พบ Subtask Action");

		fSubtaskAction.StatusId = updateData.StatusId;
		if (updateData.Remarks != null) fSubtaskAction.Remarks = updateData.Remarks;
		if (updateData.Reading != null) fSubtaskAction.Reading = updateData.Reading;
		if (updateData.MetaData != null)
		{
			updateData.MetaData = await PutMetaDataToStorage(updateData.MetaData!, updateData.AID, updateData.STID);
			fSubtaskAction.MetaData = JsonConvert.SerializeObject(updateData.MetaData);
		}
		fSubtaskAction.UpdatedBy = auditable.UpdatedBy;
		fSubtaskAction.UpdatedByName = auditable.UpdatedByName!;
		fSubtaskAction.UpdatedDate = auditable.UpdatedDate;
	}

	private async Task<GuardTourSubtaskActionMetaDataResult> PutMetaDataToStorage(GuardTourSubtaskActionMetaDataResult metaData, Guid aid, Guid stid)
	{
		if (metaData.Photos != null)
		{
			for (int i = 0; i < metaData.Photos.Count; i++)
			{
				metaData.Photos[i] = await CheckTypeAndPutMetaDataToStorage(metaData.Photos[i], aid, i, "photo", stid);
			}
		}

		if (metaData.Videos != null)
		{
			for (int i = 0; i < metaData.Videos.Count; i++)
			{
				metaData.Videos[i] = await CheckTypeAndPutMetaDataToStorage(metaData.Videos[i], aid, i, "video", stid);
			}
		}

		if (metaData.Files != null)
		{
			for (int i = 0; i < metaData.Files.Count; i++)
			{
				metaData.Files[i] = await CheckTypeAndPutMetaDataToStorage(metaData.Files[i], aid, i, "file", stid);
			}
		}

		if (metaData.PhotoList != null)
		{
			for (int i = 0; i < metaData.PhotoList.Count; i++)
			{
				var resultUploadList = await CheckTypeAndPutMetaDataToStorage(metaData.PhotoList[i].Base64, aid, i, "photos", stid, metaData.PhotoList[i].Date);
				metaData.PhotoList[i] = new GuardTourSubtaskActionMetaDataBase64{
					Base64 = resultUploadList,
					Date = metaData.PhotoList[i].Date
				};
			}
		}

		return metaData;
	}

	private async Task<string> CheckTypeAndPutMetaDataToStorage(string metaData, Guid aid, int i, string dataType, Guid stid, string date = null)
	{
		string convertBase64String = Regex.Replace(metaData, "data:(image/png|image/jpg|image/jpeg|video/mp4|application/gzip|application/pdf|application/zip|application/doc|application/docx);base64,", String.Empty);
		string dateFromBase64 = "";
		if (dataType == "photos" && date != null) {
			dateFromBase64 = date;
		}
		var dataName = aid + "_" + stid + "_" + dataType + "_" + i + GetImageFormatFromBase64String(metaData);
		var objectName = $"{dataName}";
		var pathName = DomainConfig.Minio.BucketGuardtourName;
		if (pathName != null && pathName != ""){
			objectName = $"{pathName}/{dataName}";
		}
		await _minioservice.PutObject(DomainConfig.Minio.BucketName, convertBase64String, objectName, dateFromBase64);
		return dataName;
	}

	private static string GetImageFormatFromBase64String(string base64String)
	{
		if (base64String.StartsWith("data:image/jpg;base64,"))
			return ".jpg";
		else if (base64String.StartsWith("data:image/jpeg;base64,"))
			return ".jpeg";
		else if (base64String.StartsWith("data:image/png;base64,"))
			return ".png";
		else if (base64String.StartsWith("data:video/mp4;base64,"))
			return ".mp4";
		else if (base64String.StartsWith("data:application/gzip;base64,"))
			return ".gz";
		else if (base64String.StartsWith("data:application/pdf;base64,"))
			return ".pdf";
		else if (base64String.StartsWith("data:application/zip;base64,"))
			return ".zip";
		else if (base64String.StartsWith("data:application/doc;base64,"))
			return ".doc";
		else if (base64String.StartsWith("data:application/docx;base64,"))
			return ".docx";
		else
			return "Unknown"; // Handle unrecognized formats or invalid base64 strings
	}

	public async Task UpdateSubtaskActionsStatus(Guid stid, int statusCheck, int statusUpdate, AuditableModel auditable)
	{
		var fSubtaskActions = await Db.AsTracking().Where(x => x.StatusId == statusCheck && x.Subtask == stid).ToListAsync();
		foreach (var fSubtaskAction in fSubtaskActions)
		{
			fSubtaskAction.StatusId = statusUpdate;
			fSubtaskAction.UpdatedBy = auditable.UpdatedBy;
			fSubtaskAction.UpdatedByName = auditable.UpdatedByName!;
			fSubtaskAction.UpdatedDate = auditable.UpdatedDate;
		}
	}
	public async Task CreateSubtaskAction(List<CreateSubtaskActionModel> fSubtaskActions, AuditableModel auditable)
	{
		foreach (var fSubtaskAction in fSubtaskActions)
		{
			Db.AddRange(
				fSubtaskAction.AIDS
				.Select((fAction, i) => new trSubtaskAction
				{
					Subtask = fSubtaskAction.STID,
					Action = fAction,
					Seq = i + 1,
					StatusId = fSubtaskAction.StatusId,
					CreatedBy = auditable.CreatedBy,
					CreatedByName = auditable.CreatedByName!,
					CreatedDate = auditable.CreatedDate,
					UpdatedBy = auditable.UpdatedBy,
					UpdatedByName = auditable.UpdatedByName!,
					UpdatedDate = auditable.UpdatedDate,
				}));
		}
	}

	public async Task RemoveSubtaskActions(List<Guid> stids)
	{
		var dataRemove = Db.AsTracking()
				.Where(x => stids.Contains(x.Subtask));
		Db.RemoveRange(dataRemove);
	}
	public async Task<List<trSubtaskAction>> GetAll(Guid? stid, Guid? aid, bool scope, int? statusId, bool isSkip)
	{
		var query = GetAllQueryBuilder(stid, aid, scope, statusId, isSkip);
		var result = await query.ToListAsync();
		if (result == null) throw new NotFoundException("ไม่พบ Subtask Action");
		return result;
	}

	private IQueryable<trSubtaskAction> GetAllQueryBuilder(Guid? stid, Guid? aid, bool scope, int? statusId, bool isSkip)
	{
		var query = Db.AsQueryable();
		if (stid != null) query = query.Where(x => x.Subtask == stid);
		if (aid != null) query = query.Where(x => x.Action == aid);
		if (statusId != null) query = query.Where(x => x.StatusId == statusId);
		if (scope == true || isSkip == true)
		{
			query = query.Include(x => x.trAction).ThenInclude(x => x.mtActionType);
			if (isSkip == true)
			{
				query = query.Where(x => x.trAction.IsRequired == 1);
			}
		}
		return query;
	}


}
