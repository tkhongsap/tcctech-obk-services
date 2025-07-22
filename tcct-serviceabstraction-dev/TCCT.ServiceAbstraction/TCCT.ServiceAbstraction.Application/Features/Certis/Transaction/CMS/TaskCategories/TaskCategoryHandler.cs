using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.TaskCategories;
public class TaskCategoryHandler : IQueryHandler<TaskCategoryQuery, List<TaskCategoryResult>>
{
	private readonly ICertisService _certisservice;
	public TaskCategoryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<TaskCategoryResult>> Handle(TaskCategoryQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetTaskCategory();
	}
}