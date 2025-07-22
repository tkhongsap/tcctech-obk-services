namespace TCCTOBK.OperationBackend.Application.Contracts.Minio;
public interface IMinioService
{
	Task PutObject(string backetNameString, string base64URL, string objectName, string? dateCreate = null);
	Task<string> GetObject(string backetNameString, string objectName);
	Task<long> GetObjectSize(string bucketNameString, string objectName);
	Task<string> GetObjectMeta(string backetNameString, string objectName);
}
