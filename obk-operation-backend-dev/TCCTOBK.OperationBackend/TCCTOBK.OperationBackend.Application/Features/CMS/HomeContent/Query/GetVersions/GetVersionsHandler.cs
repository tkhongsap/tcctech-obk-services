using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;

public class GetVersionsHandler : IQueryHandler<GetVersionsQuery, GetVersionsResult>
{
	IUnitOfWork _uow;

	public GetVersionsHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<GetVersionsResult> Handle(GetVersionsQuery request, CancellationToken cancellationToken)
	{
		var data = await _uow.HomeContentRepository.GetList(request);
		var totalCount = await _uow.HomeContentRepository.GetListCount();

		var normalizedData = data.Select(x => new HomeContentVersion()
		{
			HCID = x.HCID,
			Version = x.Version,
			UpdatedDate = x.UpdatedDate.ToString("yyyy-MM-dd HH:mm"),
			UpdatedBy = x.UpdatedByName
		}).ToList();

		return new GetVersionsResult(totalCount, normalizedData);
	}
}
