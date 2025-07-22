using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetHappening;

public class CategoryListHandler : IQueryHandler<CategoryListQuery, CategoryListResult>
{
	IUnitOfWork _uow;
	public CategoryListHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<CategoryListResult> Handle(CategoryListQuery request, CancellationToken cancellationToken)
	{
		CategoryListResult result = await _uow.MarcomRepository.GetCategory(request.HappeningID);
		
		return result;
	}
}


	