using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllCategory;

public class GetAllCategoryHandler : IQueryHandler<GetAllCategoryQuery, GetAllCategoryResult>
{
	IUnitOfWork _uow;
	public GetAllCategoryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllCategoryResult> Handle(GetAllCategoryQuery request, CancellationToken cancellationToken)
	{
		CategoryResult category = await _uow.MarcomRepository.GetAllCategory(request.Filter, request.Status, request);
		GetAllCategoryResult result = new GetAllCategoryResult()
		{
			Data = category,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}
}
