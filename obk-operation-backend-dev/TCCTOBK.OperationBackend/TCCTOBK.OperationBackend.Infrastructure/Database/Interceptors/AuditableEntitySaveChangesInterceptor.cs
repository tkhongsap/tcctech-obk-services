//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.ChangeTracking;
//using Microsoft.EntityFrameworkCore.Diagnostics;
//using TCCTOBK.OperationBackend.Application.Helper.Service;
//using TCCTOBK.OperationBackend.Domain.Common;

//namespace TCCTOBK.OperationBackend.Infrastructure.Interceptors;

//public class AuditableEntitySaveChangesInterceptor : SaveChangesInterceptor
//{
//	private readonly IAuditableService _auditableService;

//	public AuditableEntitySaveChangesInterceptor(IAuditableService auditableService)
//	{
//		_auditableService = auditableService;
//	}

//	public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
//	{
//		if (eventData.Context != null)
//		{
//			UpdateEntities(eventData.Context);
//		}
//		return base.SavingChanges(eventData, result);
//	}

//	public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
//		InterceptionResult<int> result, CancellationToken cancellationToken = default)
//	{
//		if (eventData.Context != null)
//		{
//			UpdateEntities(eventData.Context);
//		}

//		return base.SavingChangesAsync(eventData, result, cancellationToken);
//	}

//	public void UpdateEntities(DbContext context)
//	{
//		if (context == null) return;

//		foreach (var entry in context.ChangeTracker.Entries<Auditable>())
//		{
//			var keyCloaKUserId = _auditableService.KeyCloakUserId;
//			var memberName = _auditableService.MemberName;
//			if (entry.State == EntityState.Added)
//			{
//				entry.Entity.CreatedByName = entry.Entity.CreatedByName ?? memberName;
//				entry.Entity.CreatedBy = Guid.Parse(keyCloaKUserId);
//				entry.Entity.CreatedDate = DateTime.Now;
//			}

//			if (entry.State == EntityState.Added || entry.State == EntityState.Modified ||
//					entry.HasChangedOwnedEntities())
//			{
//				entry.Entity.UpdatedByName = memberName;
//				entry.Entity.UpdatedBy = Guid.Parse(keyCloaKUserId);
//				entry.Entity.UpdatedDate = DateTime.Now;
//			}
//		}
//	}
//}

//public static class Extensions
//{
//	public static bool HasChangedOwnedEntities(this EntityEntry entry) =>
//		entry.References.Any(r =>
//			r.TargetEntry != null &&
//			r.TargetEntry.Metadata.IsOwned() &&
//			(r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
//}