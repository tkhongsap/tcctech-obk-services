using System.CodeDom;
using TCCTOBK.OperationBackend.Domain;
using System.Text.RegularExpressions;
using Minio;
using Minio.DataModel.Args;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Infrastructure.ObjectStorage;

public class MinioService : IMinioService
{
	private readonly IMinioClient _minioClient;
	private readonly IClientSiteService _clientSiteService;
	public MinioService(IMinioClient minioClient, IClientSiteService clientSiteService)
	{
		_minioClient = minioClient;
		_clientSiteService = clientSiteService;
	}

	public async Task PutObject(string backetNameString, string base64URL, string objectName, string? dateCreate = null)
	{
		try {
			string convertBase64StringImage = base64URL;

			if (_clientSiteService.ClientSiteId == Constant.PARQ_CLIENT_SITE)
			{
				backetNameString = DomainConfig.Minio.BucketNameParQ;
			}

			Minio.DataModel.Args.BucketExistsArgs bucketName = new Minio.DataModel.Args.BucketExistsArgs().WithBucket(backetNameString);
			byte[] imageBytes = Convert.FromBase64String(convertBase64StringImage);

			// Check if bucket exists, create if not (optional)
			bool bucketExists = await _minioClient.BucketExistsAsync(bucketName);
			if (!bucketExists)
			{
				await _minioClient.MakeBucketAsync(new Minio.DataModel.Args.MakeBucketArgs().WithBucket(backetNameString));
			}

			//Upload object to Minio
			using (var stream = new MemoryStream(imageBytes))
			{
				PutObjectArgs putObjectArgs = new PutObjectArgs()
										.WithBucket(backetNameString)
										.WithObject(objectName)
										.WithStreamData(stream)
										.WithObjectSize(stream.Length)
										.WithContentType("application/octet-stream");

				// Add custom metadata headers
				if (dateCreate != null)
				{
					var metadata = new Dictionary<string, string>
					{
						{ "x-opsapp-date-create", dateCreate }
					};
					foreach (var item in metadata)
					{
						putObjectArgs.WithHeaders(metadata);
					}
				}

				var rt = await _minioClient.PutObjectAsync(putObjectArgs);
				Console.WriteLine($"Successfully uploaded {objectName} to Minio");
			}
		} catch (Exception ex) {
			Console.WriteLine($"Error uploading object: {ex.Message}");
			throw new Exception(ex.Message);
		}
	}
	public async Task<string> GetObject(string backetNameString, string objectName)
	{
		try {
				PresignedGetObjectArgs getObjectArgs = new PresignedGetObjectArgs()
										.WithBucket(_clientSiteService.ClientSiteId == Constant.PARQ_CLIENT_SITE? DomainConfig.Minio.BucketNameParQ : backetNameString)
										.WithObject(objectName)
										.WithExpiry(604800);						

				return await _minioClient.PresignedGetObjectAsync(getObjectArgs);
		} catch (Exception ex) {
			Console.WriteLine($"Error uploading object: {ex.Message}");
			throw new Exception(ex.Message);
		}
	}

	public async Task<string> GetObjectMeta(string backetNameString, string objectName)
	{
		try {
				GetObjectArgs getObjectArgs = new GetObjectArgs()
										.WithBucket(backetNameString)
										.WithObject(objectName)
										.WithFile(objectName);	
														
				var a = await _minioClient.GetObjectAsync(getObjectArgs);
				if (a.MetaData.ContainsKey("x-opsapp-date-create")) {
					return a.MetaData["x-opsapp-date-create"];
				}
				return "";
		} catch (Exception ex) {
			Console.WriteLine($"Error uploading object: {ex.Message}");
			throw new Exception(ex.Message);
		}
	}
	
	public async Task<long> GetObjectSize(string bucketNameString, string objectName)
	{
		try
		{
			StatObjectArgs statObjectArgs = new StatObjectArgs()
															.WithBucket(bucketNameString)
															.WithObject(objectName);

			var objectStat = await _minioClient.StatObjectAsync(statObjectArgs);

			return objectStat.Size;
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Error retrieving object size: {ex.Message}");
			throw new Exception(ex.Message);
		}
	}
}
