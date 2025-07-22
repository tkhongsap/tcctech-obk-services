namespace TCCTOBK.OperationBackend.Domain;
public class MinioConfig
{
	public string Host { get; set; } = default!;
	public string AccessKey { get; set; } = default!;
	public string SecretKey { get; set; } = default!;
	public string PublicHost { get; set; } = default!;
	public string BucketGuardtourName { get; set; } = default!;
	public string BucketName { get; set; } = default!;
	public string BucketNameParQ { get; set; } = default!;
	public string BucketLBS { get; set; } = default!;
    public string BucketServiceRequest { get; set; } = default!;
	public string BucketNameImage { get; set; } = default!;

	public void GetEnvironmentVariables()
    {
        Host = Environment.GetEnvironmentVariable("MINIO_HOST")!;
        AccessKey = Environment.GetEnvironmentVariable("MINIO_ACCESS_KEY")!;
        SecretKey = Environment.GetEnvironmentVariable("MINIO_SECRET_KEY")!;
        PublicHost = Environment.GetEnvironmentVariable("MINIO_PUBLIC_HOST")!;
        BucketGuardtourName = Environment.GetEnvironmentVariable("MINIO_BUCKET_GUARDTOUR_NAME")!;
        BucketName = Environment.GetEnvironmentVariable("MINIO_BUCKET_NAME")!;
        BucketLBS = Environment.GetEnvironmentVariable("MINIO_BUCKET_LBS")!;
        BucketServiceRequest = Environment.GetEnvironmentVariable("MINIO_BUCKET_SERVICE_REQUEST")!;
        BucketNameParQ = Environment.GetEnvironmentVariable("MINIO_THE_PARQ_BUCKET_NAME")!;
		BucketNameImage = Environment.GetEnvironmentVariable("MINIO_BUCKET_NAME_IMAGE")!;
    }

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("MINIO_HOST", Host);
		Environment.SetEnvironmentVariable("MINIO_ACCESS_KEY", AccessKey);
		Environment.SetEnvironmentVariable("MINIO_SECRET_KEY", SecretKey);
		Environment.SetEnvironmentVariable("MINIO_PUBLIC_HOST", PublicHost);
		Environment.SetEnvironmentVariable("MINIO_BUCKET_GUARDTOUR_NAME", BucketGuardtourName);
		Environment.SetEnvironmentVariable("MINIO_BUCKET_NAME", BucketName);
		Environment.SetEnvironmentVariable("MINIO_BUCKET_LBS", BucketLBS);
		Environment.SetEnvironmentVariable("MINIO_BUCKET_SERVICE_REQUEST", BucketServiceRequest);
		Environment.SetEnvironmentVariable("MINIO_THE_PARQ_BUCKET_NAME", BucketNameParQ);
		Environment.SetEnvironmentVariable("MINIO_BUCKET_NAME_IMAGE", BucketNameImage);
	}
}
