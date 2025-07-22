using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedChecklistTask;
public class FMRelatedChecklistTaskHandler : IQueryHandler<FMRelatedChecklistTaskQuery, FMRelatedChecklistTaskResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedChecklistTaskHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedChecklistTaskResult> Handle(FMRelatedChecklistTaskQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedChecklistTaskResult();
		#endregion

		var reslist = await _masterDataService.FMRelatedChecklistsTasks(_apiService.MasterData.FMRelatedChecklistsTasks);
		var resp = reslist.FirstOrDefault();
		resp.TaskId = resp.TaskId;
		resp.Description = resp.Description;
		resp.IsMandatory = resp.IsMandatory;
		resp.IsAttachmentRequired = resp.IsAttachmentRequired;
		resp.IsReadingRequired = resp.IsReadingRequired;
		resp.Duration = resp.Duration;
		return res;
	}
}