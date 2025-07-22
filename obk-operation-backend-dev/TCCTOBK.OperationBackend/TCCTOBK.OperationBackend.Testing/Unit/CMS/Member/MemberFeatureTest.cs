using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Infrastructure.Database;

namespace TCCTOBK.OperationBackend.Testing;

public class MemberFeatureTest
{
	private DbContextOptions<TCCTOBKContext> _dbcontextoptions;

	[SetUp]
	public void Setup()
	{
		TestHelper.SetupCulture();
		_dbcontextoptions = TestHelper.GetInMemoryDBContextOptions();
	}

	// [Test]
	// [Category("Member")]
	// public async Task T001_InviteMember()
	// {
	// 	var context = new TCCTOBKContext(_dbcontextoptions);

	// 	var rid = Guid.NewGuid();
	// 	context.Roles.Add(new trRole() { RID = rid, Name = "test", Description = "", IsActive = true });
	// 	await context.SaveChangesAsync();

	// 	// var uow = new UnitOfWork(context);
	// 	// var mockmail = new Mock<TCCTOBK.OperationBackend.Application.IMailService>();
	// 	// var mockhandler = new InviteMemberHandler(uow, mockmail.Object);

	// 	// {
	// 	// 	var email = "test1@test.com";
	// 	// 	var command = new InviteMemberCommand(email, new List<Guid>() { rid });
	// 	// 	var actual = await mockhandler.Handle(command, default);
	// 	// 	Assert.That(context.Member.Count(), Is.EqualTo(1));

	// 	// 	var member = context.Member.Include(x => x.trRoleMembers).FirstOrDefault();
	// 	// 	Assert.That(member.Email, Is.EqualTo(email));
	// 	// 	Assert.That(member.trRoleMembers.Count, Is.EqualTo(1));
	// 	// 	Assert.That(member.trRoleMembers[0].RID, Is.EqualTo(rid));
	// 	// }
	// }


	// [Test]
	// [Category("Member")]
	// public async Task T002_InviteMember_Error()
	// {
	// 	var context = new TCCTOBKContext(_dbcontextoptions);

	// 	var email = "test1@test.com";
	// 	var rid = Guid.NewGuid();
	// 	context.Member.Add(new taMember() { Email = email, DataJson = "{}" });
	// 	await context.SaveChangesAsync();

	// 	// var uow = new UnitOfWork(context);
	// 	// var mockmail = new Mock<TCCTOBK.OperationBackend.Application.IMailService>();
	// 	// var mockhandler = new InviteMemberHandler(uow, mockmail.Object);

	// 	// try
	// 	// {
	// 	// 	var command = new InviteMemberCommand(email, new List<Guid>() { rid });
	// 	// 	var actual = await mockhandler.Handle(command, default);
	// 	// 	Assert.Fail();
	// 	// }
	// 	// catch (BadRequestException ee)
	// 	// {
	// 	// 	Assert.Pass();
	// 	// }
	// }

}
