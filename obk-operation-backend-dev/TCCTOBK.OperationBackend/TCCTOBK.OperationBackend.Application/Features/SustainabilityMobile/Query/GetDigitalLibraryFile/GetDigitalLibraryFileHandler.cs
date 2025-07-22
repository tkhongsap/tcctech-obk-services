using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryFile;
public class GetDigitalLibraryFileHandler : IQueryHandler<GetDigitalLibraryFileQuery, GetDigitalFileResult>
{
	readonly IUnitOfWork _uow;
	private readonly IMinioService _minioService;
	public GetDigitalLibraryFileHandler(IUnitOfWork uow, IMinioService minioservice)
	{
		_uow = uow;
		_minioService = minioservice;
	}
	public async Task<GetDigitalFileResult> Handle(GetDigitalLibraryFileQuery request, CancellationToken cancellationToken)
	{
		var lstDigitalCategoryAll = await _uow.SustainabilityMobileRepository.GetDigitalLibraryAll();
		var lstDigitalFileAll = await _uow.SustainabilityMobileRepository.GetDigitalLibraryFileAll();

		var objParent = lstDigitalCategoryAll.Where(w => w.Id == request.Param.sID).FirstOrDefault();

		GetDigitalFileResult result = new GetDigitalFileResult();

		if (objParent != null)
		{
			result.sHeaderNav = "Digital Library";

			//List Content If Not has data in select lang use en instead
			var hasDataInLang = true;
			switch (request.Param.sLanguage)
			{
				case "en": hasDataInLang = !string.IsNullOrEmpty(objParent.TopicEN); break;
				case "th": hasDataInLang = !string.IsNullOrEmpty(objParent.TopicTH); break;
				case "zh": hasDataInLang = !string.IsNullOrEmpty(objParent.TopicCN); break;
			}
			if (!hasDataInLang) request.Param.sLanguage = "en";
			var lstDigitalFile = lstDigitalFileAll.Where(w => w.TopicId == request.Param.sID && w.Language == request.Param.sLanguage).ToList();

			result.sTitle = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objParent.TopicEN, objParent.TopicTH, objParent.TopicCN);
			result.sIntroduce = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objParent.IntroduceEN, objParent.IntroduceTH, objParent.IntroduceCN, true);

			//File Download
			var lstDigitalFileResult = new List<FileDownloadItem>();

			foreach (var iF in lstDigitalFile)
			{
				var sURLFile = await _minioService.GetObject(iF.AttachFileURL, iF.AttachFileName);

				var objFile = new FileDownloadItem();
				objFile.sID = iF.Id;
				objFile.sPathCover = iF.CoverImageURL;
				objFile.sPathFile = sURLFile;
				objFile.sFileName = iF.AttachOriginalFileName;
				objFile.sType = iF.AttachFileType;
				objFile.sSize = iF.AttachFileSize;

				lstDigitalFileResult.Add(objFile);
			}
			result.lstFile = lstDigitalFileResult;
		}

		return result;
	}

}
