using System.Text.Json.Serialization;
using Newtonsoft.Json;
using NPOI.SS.Formula.Functions;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;
public class GetSubtaskQueryHandler : IQueryHandler<GetSubtaskQuery, GetSubtaskResult>
{
	IUnitOfWork _uow;
	IMinioService _minioService;
	public GetSubtaskQueryHandler(IUnitOfWork uow, IMinioService minioService)
	{
		_uow = uow;
		_minioService = minioService;
	}
	public async Task<GetSubtaskResult> Handle(GetSubtaskQuery request, CancellationToken cancellationToken)
	{
		var subtasks = await _uow.SubtaskRepository.GetAll(request.Filter, request.SubTaskIds, request);
		var countSubtasks = await _uow.SubtaskRepository.GetAllCount(request.Filter, request.SubTaskIds);
		var mapSubtask = await MapSubtask(subtasks, null, false);

		return new GetSubtaskResult(countSubtasks, mapSubtask.Item1, mapSubtask.Item2, mapSubtask.Item3);
	}
	public async Task<(float, float, List<GetSubtask>)> MapSubtask(List<trSubtask> subtasks, string? locationName, bool isReport)
	{
		var res = new List<GetSubtask>();
		var countRequired = 0;
		var countCompleted = 0;
		var countFailed = 0;
		var checkRequired = 0;
		var isHaveIncomplete = 0;
		foreach (var item in subtasks)
		{
			var readyToComplete = item.trSubtaskAction.Count(x => x.StatusId == Constant.GUARD_TOUR_STATUS_COMPLETED || x.StatusId == Constant.GUARD_TOUR_STATUS_INCOMPLETE || x.StatusId == Constant.GUARD_TOUR_STATUS_SKIP) == item.trSubtaskAction.Count ? true : false;
			var actionList = new List<Action>();
			var actionListOrder = item.trSubtaskAction.OrderBy(action => action.Seq).ToList();
			foreach (var action in actionListOrder)
			{
				if (action.trAction.IsRequired == 1)
				{
					countRequired++;
					if (action.StatusId > 0)
					{
						if (action.StatusId == Constant.GUARD_TOUR_STATUS_COMPLETED)
						{
							countCompleted++;
						}
						else
						{
							countFailed++;
						}
					}
				}
				if (action.StatusId == Constant.GUARD_TOUR_STATUS_ASSIGNED && action.trAction.IsRequired == 1) { checkRequired = 1; }
				if ((action.StatusId == Constant.GUARD_TOUR_STATUS_INCOMPLETE || action.StatusId == Constant.GUARD_TOUR_STATUS_SKIP) && action.trAction.IsRequired == 1) { isHaveIncomplete = 1; }
				var metaDataResult = new GuardTourSubtaskActionMetaDataResult
				{
					Videos = new List<string>(),
					Files = new List<string>(),
					Photos = new List<string>(),
					PhotoList = new List<GuardTourSubtaskActionMetaDataBase64>(),
				};
				if (action.MetaData != null)
				{
					var metaData = JsonConvert.DeserializeObject<GuardTourSubtaskActionMetaDataResult>(action.MetaData)!;
					if (metaData.Photos != null)
					{
						foreach (var itemMeta in metaData.Photos)
						{
							metaDataResult.Photos.Add(await getObjectFromMinio(itemMeta));
						}
					}
					if (metaData.Videos != null)
					{
						if (isReport == true) {
							metaDataResult.Videos = metaData.Videos;
						} else {
							foreach (var itemMeta in metaData.Videos)
							{
								metaDataResult.Videos.Add(await getObjectFromMinio(itemMeta));
							}
						}
						
					}
					if (metaData.Files != null)
					{
						if (isReport == true) {
							metaDataResult.Files = metaData.Files;
						} else {
							foreach (var itemMeta in metaData.Files)
							{
								metaDataResult.Files.Add(await getObjectFromMinio(itemMeta));
							}
						}
					}
					if (metaData.PhotoList != null)
					{
						foreach (var itemMeta in metaData.PhotoList)
						{
							var imagePath = await getObjectFromMinio(itemMeta.Base64);
							metaDataResult.PhotoList.Add(new GuardTourSubtaskActionMetaDataBase64{
								Path = imagePath,
								Date = itemMeta.Date,
							});
						}
					}
				}

				actionList.Add(new Action()
				{
					ActionId = action.trAction.Id,
					Name = action.trAction.Name,
					Description = action.trAction.Description,
					Status = action.StatusId,
					Remarks = action.Remarks,
					IsRequired = action.trAction.IsRequired,
					Reading = action.Reading,
					MetaData = metaDataResult,
					ActionType = action.trAction.mtActionType.Action
				});

			}
			var locationSubtaskName = locationName == null ? item.Name : $"{locationName}, {item.Name}";
			var rs = new GetSubtask()
			{
				Id = item.Id,
				Name = locationSubtaskName,
				IsRequired = checkRequired,
				IsHaveIncomplete = isHaveIncomplete,
				Remarks = item.Remarks,
				Status = readyToComplete && (item.StatusId == Constant.GUARD_TOUR_STATUS_INPROGRESS || item.StatusId == Constant.GUARD_TOUR_STATUS_ASSIGNED) ? Constant.GUARD_TOUR_STATUS_READY_FOR_COMPLETED : item.StatusId,
				Action = actionList,
				UpdatedDate = item.UpdatedDate.ToString(),
				UpdatedBy = item.UpdatedBy
			};
			res.Add(rs);
		}

		var percentSuccess = countRequired > 0 ? (countCompleted * 100) / countRequired : 0;
		var percentFailed = countRequired > 0 ? (countFailed * 100) / countRequired : 0;
		if (countCompleted + countFailed == countRequired)
		{
			percentFailed = countRequired - countCompleted;
		}

		return (percentSuccess, percentFailed, res);
	}

	private async Task<string> getObjectFromMinio(string itemMeta)
	{
		var buckerName = DomainConfig.Minio.BucketName;
		var pathName = DomainConfig.Minio.BucketGuardtourName;
		var objectName = $"{itemMeta}";
		if (pathName != null && pathName != "") {
			objectName = $"{pathName}/{itemMeta}";
		}
		return await _minioService.GetObject(buckerName, objectName);
	}
}
