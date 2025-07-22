using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Infrastructure.Database;

namespace TCCTOBK.OperationBackend.Testing;

public class PrivilegeFeatureTest
{
	private DbContextOptions<TCCTOBKContext> _dbcontextoptions;

	[SetUp]
	public void Setup()
	{
		TestHelper.SetupCulture();
		_dbcontextoptions = TestHelper.GetInMemoryDBContextOptions();
	}

	//[Test]
	//[Category("Create Success")]
	//public async Task T001_CreatePrivilege()
	//{
	//	var context = new TCCTOBKContext(_dbcontextoptions, null);
	//	await context.SaveChangesAsync();

	//	var uow = new UnitOfWork(context);
	//	var mocklog = new Mock<ILogger<CreatePrivilegesHandler>>();
	//	var mockhandler = new CreatePrivilegesHandler(uow, mocklog.Object);

	//	{
	//		var command = new CreatePrivilegeCommand("test", "test", true, new List<CreatePrivilegeItem>()
	//		{
	//			new CreatePrivilegeItem()
	//			{
	//				Name = "test",
	//				Description = "test",
	//				IsActive = true,
	//				Code = "test"
	//			}
	//		});

	//		var actual = await mockhandler.Handle(command, default);

	//		Assert.That(context.Privileges.Count(), Is.EqualTo(1));

	//		var res = context.Privileges.FirstOrDefault();
	//		Assert.That(res, Is.Not.Null);
	//		Assert.That(res.Name, Is.EqualTo("test"));
	//	}



	//var context = new TCCTOBKContext(_tcctobkcontext, _dbcontextoptions);
	//await context.SaveChangesAsync();
	//var nrole = new trRole()
	//{
	//  RID = Guid.NewGuid(),
	//  Name = "Role1",
	//  Description = "Role1Description",
	//  IsActive = true
	//};
	//var nprivilege = new mtPrivilege()
	//{
	//  PID = Guid.NewGuid(),
	//  Name = "Privilege1",
	//  Description = "PrivilegeDescription1",
	//  IsActive = true,
	//};
	//var nprivilegeitem = new mtPrivilegeItem()
	//{
	//  PTID = Guid.NewGuid(),
	//  PID = nprivilege.PID,
	//  mtPrivilege = nprivilege,
	//  Name = "PItem1",
	//  Description = "PItemDescription1",
	//  Code = "PP001",
	//  IsActive = true,
	//};
	//var nroleprivilege = new trRolePrivilege()
	//{
	//  RID = nrole.RID,
	//  trRole = nrole,
	//  PID = nprivilege.PID,
	//  mtPrivilege = nprivilege,
	//  IsActive = true,
	//};

	//await context.Roles.AddAsync(nrole);
	//await context.PrivilegeItems.AddAsync(nprivilegeitem);
	//await context.Privileges.AddAsync(nprivilege);
	//await context.RolePrivileges.AddAsync(nroleprivilege);
	//await context.SaveChangesAsync();


	//var repo = new TCCTOBKContext(context, _dbcontextoptions);
	//// var mocklog = new Mock<ILogger<CreatePrivilegeHandler>>();
	//var mockhandler = new GetPrivilegesHandler(_uow);
	//{
	//  var query = new GetPrivilegesQuery();
	//  var actual = await mockhandler.Handle(query, default);
	//  Assert.That(actual.Count() > 0);
	//}


	//Assert.Pass();
	//}
}
