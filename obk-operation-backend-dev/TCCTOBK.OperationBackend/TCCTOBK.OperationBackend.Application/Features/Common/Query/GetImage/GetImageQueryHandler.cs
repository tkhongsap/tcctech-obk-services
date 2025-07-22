using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Common.Query.GetImage;
public class GetImageQueryHandler : IQueryHandler<GetImageQuery, List<GetImageResult>>
{
	IMinioService _minioService;
	public GetImageQueryHandler(IUnitOfWork uow, IMinioService minioService)
	{
		_minioService = minioService;
	}
	public async Task<List<GetImageResult>> Handle(GetImageQuery request, CancellationToken cancellationToken)
	{
		var res = new List<GetImageResult>();
		foreach (var item in request.ImageList.Split(","))
		{
			var itemMeta = item.Trim();
			if (itemMeta != null && itemMeta != "")
			{
				var objectName = await getObjectFromMinio(itemMeta);
				res.Add(new GetImageResult()
				{
					ImageUrl = objectName,
					Name = itemMeta,
				});
			}
		}

		return res;
	}

	private async Task<string> getObjectFromMinio(string itemMeta)
	{
		var buckerName = DomainConfig.Minio.BucketNameImage;
		var objectName = $"{itemMeta}";
		return await _minioService.GetObject(buckerName, objectName);
	}
}
