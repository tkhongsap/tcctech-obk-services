using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Infrastructure;
using TCCTOBK.OperationBackend.Infrastructure.SeedData;

namespace TCCTOBK.OperationBackend.Api;

public class Worker : IHostedService
{
	private readonly IServiceProvider _serviceProvider;
	public Worker(IServiceProvider serviceProvider)
			=> _serviceProvider = serviceProvider;

	public async Task StartAsync(CancellationToken cancellationToken)
	{
		var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
		if (env == Environments.Development || env == Environments.Staging)
		{
			//using var scope = _serviceProvider.CreateScope();
			//var context = scope.ServiceProvider.GetRequiredService<ITCCTOBKContext>();
			//await context.Database.EnsureCreatedAsync();

			// Temporary insert menu remove later.
			//await context.Database.ExecuteSqlRawAsync(@"TRUNCATE TABLE ""trActivityProcedure"" CASCADE;");
			//await context.Database.ExecuteSqlRawAsync(@"TRUNCATE TABLE ""trAction"" CASCADE;");
			//await context.Database.ExecuteSqlRawAsync(@"TRUNCATE TABLE ""trSchedulePlan"" CASCADE;");
			//await context.Database.ExecuteSqlRawAsync(@"TRUNCATE TABLE ""Location"" CASCADE;");
			
			//await context.AppMenu.AddRangeAsync(MenuSeedData.Data);

			//if (!await context.RoleMembers.AnyAsync())
			//{
			//	await context.Member.AddAsync(MemberRoleSeedData.Member);
			//	await context.Roles.AddAsync(MemberRoleSeedData.Role);
			//	await context.RoleMembers.AddAsync(MemberRoleSeedData.RoleMember);
			//	await context.Privileges.AddRangeAsync(PrivilegeSeedData.PrivilegesData);
			//	await context.PrivilegeItems.AddRangeAsync(PrivilegeSeedData.PrivilegeItemsData);
			//	await context.RolePrivilegesItem.AddRangeAsync(MemberRoleSeedData.RolePrivilegeItemData);
			//}

			//await context.Location.AddRangeAsync(LocationSeedData.GenerateLocation());
			//await context.Unit.AddRangeAsync(UnitSeedData.GenerateUnit());
			//await context.Action.AddRangeAsync(GuardTourSeedData.GenerateAction());
			//await context.Action.AddRangeAsync(ActionSeedData.GenerateActions());
			//await context.ActivityProcedure.AddRangeAsync(ActivityProcedureSeedData.GenerateActivityProcedure());
			//await context.SchedulePlan.AddRangeAsync(SchedulePlanSeedData.GenerateSchedulePlan());

			//await context.Location.AddRangeAsync(LocationSeedData.GenerateLocationTower4());
			//await context.Action.AddRangeAsync(ActionSeedDataTower4.GenerateActions());
			//await context.ActivityProcedure.AddRangeAsync(ActivityProcedureTower4SeedData.GenerateActivityProcedureTower4());
			//await context.SchedulePlan.AddRangeAsync(SchedulePlanSeedTower4Data.GenerateSchedulePlanTower4());

			//await context.Location.AddRangeAsync(LocationSeedData.GenerateLocationParade());
			//await context.Action.AddRangeAsync(ActionSeedDataParade.GenerateActions());
			//await context.ActivityProcedure.AddRangeAsync(ActivityProcedureParadeSeedData.GenerateActivityProcedureParade());
			//await context.SchedulePlan.AddRangeAsync(SchedulePlanSeedParadeData.GenerateSchedulePlanParade());

			// await context.Location.AddRangeAsync(LocationSeedData.GenerateLocationTOT());
			// await context.Action.AddRangeAsync(ActionSeedDataTOT.GenerateActions());
			// await context.ActivityProcedure.AddRangeAsync(ActivityProcedureTOTSeedData.GenerateActivityProcedureTOT());
			// await context.SchedulePlan.AddRangeAsync(SchedulePlanSeedTOTData.GenerateSchedulePlanTOT());

			// await context.Location.AddRangeAsync(LocationSeedData.GenerateLocationEOT());
			// await context.Action.AddRangeAsync(ActionSeedDataEOT.GenerateActions());
			// await context.ActivityProcedure.AddRangeAsync(ActivityProcedureEOTSeedData.GenerateActivityProcedureEOT());
			// await context.SchedulePlan.AddRangeAsync(SchedulePlanSeedEOTData.GenerateSchedulePlanEOT());

			//await context.SaveChangesAsync();
		}
	}

	public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
