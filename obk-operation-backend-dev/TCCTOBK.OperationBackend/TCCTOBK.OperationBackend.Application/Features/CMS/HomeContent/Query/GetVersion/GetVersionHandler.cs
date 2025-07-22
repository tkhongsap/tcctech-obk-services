using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;

public class GetVersionHandler : IQueryHandler<GetVersionQuery, GetVersionResult>
{
	IUnitOfWork _uow;

	public GetVersionHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<GetVersionResult> Handle(GetVersionQuery request, CancellationToken cancellationToken)
	{
		var data = await _uow.HomeContentRepository.Get(request.HCID);
		var result = new GetVersionResult()
		{
			HCID = data.HCID,
			ImageURL = data.ImageURL,
			IsVisible = data.IsVisible,
			Note = data.Note ?? "",
			FileName = data.FileName,
			OriginalFileName = data.OriginalFileName,
			UpdatedDateDisplay = data.UpdatedDate.ToString("yyyy-MM-dd HH:mm"),
			UpdatedByName = data.UpdatedByName,
		};
		return result;
	}
}