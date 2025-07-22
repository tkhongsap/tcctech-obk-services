using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Infrastructure.Database;

namespace TCCTOBK.OperationBackend.Testing;

public class HomeContentFeatureTest
{
	private DbContextOptions<TCCTOBKContext> _dbcontextoptions;

	[SetUp]
	public void Setup()
	{
		TestHelper.SetupCulture();
		_dbcontextoptions = TestHelper.GetInMemoryDBContextOptions();
	}

	[Test]
	public async Task T001_Firebase()
	{
		var config = new FirebaseAdminConfig();
		var fo = new FirebaseOAuth(config);

		var token = await fo.AuthRemoteConfig();

		Assert.Pass();
	}
}
