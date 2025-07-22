using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Api.Models;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Model;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Infrastructure.Database;
using TCCTOBK.OperationBackend.Infrastructure.ObjectStorage;

namespace TCCTOBK.OperationBackend.Api.Service;

public interface ISustainability
{
	Task<UploadModelDoc> upload(HomeContentUploadRequest req);
}
public class SustainabilityService : ISustainability
{
	private readonly IMinioService _minioservice;

	public SustainabilityService(IMinioService minioservice)
	{
		_minioservice = minioservice;
	}

	public static string GenerateSystemFileName(string originalFileName)
	{
		string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);
		string extension = Path.GetExtension(originalFileName);

		string timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss_fff");

		string newFileName = $"{fileNameWithoutExtension}_{timestamp}{extension}";

		return newFileName;
	}
	private string GetFileURL(string? attachFileName)
	{
		if (string.IsNullOrEmpty(attachFileName))
		{
			return "";
		}
		var fileURL = Task.Run(() => _minioservice.GetObject("digitallibrary", attachFileName));
		fileURL.Wait();
		return fileURL.Result;
	}
	public async Task<UploadModelDoc> upload(HomeContentUploadRequest req)
	{
		UploadModelDoc result = new UploadModelDoc();
		try
		{
			var sysFilename = GenerateSystemFileName(req.FileName);
			await _minioservice.PutObject("digitallibrary", req.FileContentBase64, sysFilename);
			result.fileName = sysFilename;
			result.originalFileName = req.FileName;
			result.imageURL = GetFileURL(sysFilename);
			result.nStatusCode = 200;
		}
		catch (Exception ex)
		{
			result.nStatusCode = 500;
			result.sMessage = ex.Message;
		}

		return result;
	}
}