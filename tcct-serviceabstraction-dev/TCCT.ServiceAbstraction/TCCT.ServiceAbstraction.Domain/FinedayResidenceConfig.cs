namespace TCCT.ServiceAbstraction.Domain;
public class FinedayResidenceConfig
{
	public string EndPoint { get; set; } = null!;
	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;
	public string EndPointBooking { get; set; } = null!;
	public string Image { get; set; } = null!;
	public string MinioConfig { get; set; } = null!;
	public string OperationEndpoint { get; set; } = null!;
	

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("FINEDAYRESIDENCE_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("FINEDAYRESIDENCE_USERNAME", Username);
		Environment.SetEnvironmentVariable("FINEDAYRESIDENCE_PASSWORD", Password);
		Environment.SetEnvironmentVariable("FINEDAYRESIDENCE_ENDPOINTBOOKING", EndPointBooking);
		Environment.SetEnvironmentVariable("FINEDAYRESIDENCE_IMAGE", Image);
		Environment.SetEnvironmentVariable("FINEDAYRESIDENCE_MINIOCONFIG", MinioConfig);
		Environment.SetEnvironmentVariable("OPERATION_ENDPOINT", OperationEndpoint);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("FINEDAYRESIDENCE_ENDPOINT")!;
		Username = Environment.GetEnvironmentVariable("FINEDAYRESIDENCE_USERNAME")!;
		Password = Environment.GetEnvironmentVariable("FINEDAYRESIDENCE_PASSWORD")!;
		EndPointBooking = Environment.GetEnvironmentVariable("FINEDAYRESIDENCE_ENDPOINTBOOKING")!;
		Image = Environment.GetEnvironmentVariable("FINEDAYRESIDENCE_IMAGE")!;
		MinioConfig = Environment.GetEnvironmentVariable("FINEDAYRESIDENCE_MINIOCONFIG")!;
		OperationEndpoint = Environment.GetEnvironmentVariable("OPERATION_ENDPOINT")!;
	}
}
