using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.GetCurrentVersion;

public class GetCurrentVersionHandler : IQueryHandler<GetCurrentVersionQuery, GetCurrentVersionResult?>
{
	IUnitOfWork _uow;
	public GetCurrentVersionHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetCurrentVersionResult?> Handle(GetCurrentVersionQuery request, CancellationToken cancellationToken)
	{
		var lastversion = await _uow.HomeContentRepository.GetCurrentVersion();
		if (lastversion == null)
		{
			return null;
		}
		var res = new GetCurrentVersionResult();
		res.UpdatedDate = lastversion.UpdatedDate;
		res.UpdatedBy = lastversion.UpdatedByName;
		res.Version = lastversion.Version;
		return res;
	}
}
