namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.TestConnection;

public class TestConnectionResult
{
	public string date { get; set; } = null!;
	public ExampleDataDB exampleDataDB { get; set; } = null!;
	public string ipAddress { get; set; } = null!;
}

public class ExampleDataDB
{
	public int userID { get; set; }
	public string username { get; set; } = null!;
}

