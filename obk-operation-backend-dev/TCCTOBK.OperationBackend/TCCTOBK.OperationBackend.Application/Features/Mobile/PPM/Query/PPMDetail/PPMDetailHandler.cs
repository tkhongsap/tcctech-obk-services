using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application;

public class PPMDetailHandler : IQueryHandler<PPMDetailQuery, PPMDetailResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;
	private readonly IUnitOfWork _uow;
	public PPMDetailHandler(IAbstractionService apiService, IMasterDataService masterDataSevice, IUnitOfWork uow)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
		_uow = uow;
	}

	public async Task<PPMDetailResult> Handle(PPMDetailQuery request, CancellationToken cancellationToken)
	{
		#region masterdata
		var location = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);
		var serviceCategory = await _masterDataService.GetServiceCategories(_apiService.MasterData.GetServiceCategories);
		var supervisormd = await _masterDataService.FMsupervisors(_apiService.MasterData.FMsupervisors);
		var technicianmd = await _masterDataService.GetAllFMTechnician(_apiService.MasterData.GetAllFMTechnician);
		var serviceprovidermd = await _masterDataService.GetServiceProvider(_apiService.MasterData.GetServiceProvider);
		var documentTask = _apiService.CertisTransaction.GetDocumentFiles("PPM", request.Id.ToString());
		var documentAll = await _apiService.CertisTransaction.PPMDocumentsRelated(request.Id);
		var assetsMaster = await _masterDataService.GetAllAssets(_apiService.MasterData.GetAllAssets);

		var locationDic = location.ToDictionary(x => x.id, x => x.fullName);
		var assetsDic = assetsMaster.ToDictionary(x => x.Id, x => x.Name);

		#endregion
		var status = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8 };
		var ppmData = await _uow.PPMRepository.GetById(request.Id, true, status);
		var masterworkList = await _apiService.CertisTransaction.GetAllPPMWOS();
		var masterworkData = masterworkList.FirstOrDefault(x => x.Id == ppmData.MWOId);
		var taskppm = await _apiService.CertisTransaction.GetPPMTask(ppmData.Id);
		var serviceObjWork = await _apiService.CertisTransaction.GetServiceObjectWorkId(ppmData.Id);
		var serviceObjWorkDic = serviceObjWork.ToDictionary(x => x.id, x => new { x.objectType, x.objectId });
		var document = await documentTask;
		var images = document.Select(x => new DocumentWork { Id = x.Id, Description = x.Description, SearchTags = x.SearchTags }).ToList();
		var imageAll = documentAll.Select(x => new DocumentWork { Id = x.Id, Description = x.Description }).ToList();
		imageAll.AddRange(images);
		var totaltask = (float)taskppm.Count();
		var taskdone = (float)taskppm.Where(x => !string.IsNullOrEmpty(x.TaskStatus)).Count();
		var pg = taskdone / totaltask;
		var res = new PPMDetailResult
		{
			PPMID = ppmData.Id,
			MasterWorkId = ppmData.MWOId!.Value,
			MasterWork = masterworkData?.Name ?? null,
			WOID = ppmData.Name,
			MasterWorkTitle = masterworkData?.Title ?? null,
			FrequencyId = ppmData.FrequencyTypeId ?? 0,
			Frequency = GetFrefencyText(ppmData.FrequencyTypeId ?? 0),
			Location = location.FirstOrDefault(x => x.id == ppmData.LocationId)?.name ?? null,
			LocationId = ppmData.LocationId!.Value,
			ServiceCategory = serviceCategory.FirstOrDefault(x => x.Id == ppmData.ServiceCategoryId)?.Name ?? null,
			ServiceCategoryId = ppmData.ServiceCategoryId!.Value,
			IssueType = "-",
			IssueTypeId = 0,
			Description = masterworkData?.Description ?? null,
			TargetStart = ppmData.TargetStart == DateTime.MinValue
						? "-"
						: ppmData.TargetStart!.Value.AddHours(7).ToString("dd MMM yyyy h:mm:sstt"),
			ActualStart = ppmData.ActualStart == null

						? "-"
						: ppmData.ActualStart!.Value.AddHours(7).ToString("dd MMM yyyy h:mm:sstt"),
			TargetCompletion = ppmData.TargetCompletion == null

						? "-"
						: ppmData.TargetCompletion!.Value.AddHours(7).ToString("dd MMM yyyy h:mm:sstt"),
			ActualCompletion = ppmData.ActualCompletion == null

						? "-"
						: ppmData.ActualCompletion!.Value.AddHours(7).ToString("dd MMM yyyy h:mm:sstt"),
			ServiceProvider = serviceprovidermd.FirstOrDefault(x => x.id == ppmData.ServiceProviderId)?.name ?? null,
			CreatedBy = ppmData.CreatedBy,
			Supervisor = supervisormd.FirstOrDefault(x => x.id == ppmData.SupervisorId)?.fullName ?? null,
			SupervisorId = ppmData.SupervisorId,
			AcknowledgedTechnician = technicianmd.FirstOrDefault(x => x.Id == ppmData.AckedBy)?.FullName ?? null,
			AssignedTechnician = technicianmd.FirstOrDefault(x => x.Id == ppmData.TechniciansAssignedBy)?.FullName ?? null,
			AssignedTechnicianId = ppmData.TechniciansAssignedBy,
			Status = ppmData.StatusId,
			Progression = pg,
			StatusText = GetStatusText(ppmData.StatusId!.Value),

			TaskPPM = taskppm.Select(x => new TaskInPPM()
			{
				Id = x.Id,
				TaskNo = x.TaskNo,
				ServicingObjectId = x.ServicingObjectId,
				Description = x.Description,
				IsMandatory = x.IsMandatory,
				IsAttachmentRequired = x.IsAttachmentRequired,
				IsReadingRequired = x.IsReadingRequired,
				IsRatingRequired = x.IsRatingRequired,
				TaskStatus = x.TaskStatus,
				LocationName = serviceObjWorkDic[x.ServicingObjectId].objectType.ToLower() == "location" ? locationDic[serviceObjWorkDic[x.ServicingObjectId].objectId] : assetsDic[serviceObjWorkDic[x.ServicingObjectId].objectId],
				TaskStatusId = TaskStatusToId(x.TaskStatus),
				Documents = images.Where(d => d.SearchTags == x.Id.ToString()).ToList(),
				DocumentCount = images.Where(d => d.SearchTags == x.Id.ToString()).Count(),
			}).ToList(),
			Documents = images,
			DocumentAll = imageAll,
		};
		return res;
	}

	private int? TaskStatusToId(string? data)
	{
		if (data == null)
		{
			return null;
		}
		if (data.ToLower() == "completed" || data.ToLower() == "done")
		{
			return 1;
		}
		if (data.ToLower() == "notcompleted" || data.ToLower() == "notdone" || data.ToLower() == "not-completed" || data.ToLower() == "not done")
		{
			return 2;
		}
		return 3; //N/A

	}

	private string GetStatusText(int id)
	{
		var statustext = "N/A";
		switch (id)
		{
			case 1:
				statustext = "NOT ASSIGNED";
				break;
			case 2:
				statustext = "New";
				break;
			case 3:
				statustext = "Assigned";
				break;
			case 4:
				statustext = "In progress";
				break;
			case 5:
				statustext = "Complete";
				break;
			case 6:
				statustext = "Close";
				break;
			case 7:
				statustext = "CLIENT VERIFY";
				break;
			case 8:
				statustext = "CANCEL";
				break;
		}
		return statustext;
	}
	private string GetFrefencyText(int id)
	{
		if (id == 1) return "Daily";
		if (id == 2) return "Weekly";
		if (id == 3) return "Twice-Weekly";
		if (id == 4) return "Two-Weekly";
		if (id == 5) return "Monthly";
		if (id == 6) return "Two-Monthly";
		if (id == 7) return "Quarterly";
		if (id == 8) return "Half-Yearly";
		if (id == 9) return "Yearly";
		return "N/A";
	}
}