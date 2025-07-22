using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;
public static class TenantSeedData
{
	public static Tenant OBKCMS = new() { TID = Guid.Parse("4199e4de-bdf8-48f8-a8a8-a5b31756a748"), Name = "OBK CMS", description = "One bangkok CMS", IsActive = true, CreatedBy = Guid.Empty, CreatedDate = DateTime.Now, CreatedByName = "System", UpdatedBy = Guid.Empty, UpdatedDate = DateTime.Now, UpdatedByName = "System", };
	public static Tenant OPAPP = new() { TID = Guid.Parse("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), Name = "Operation app", description = "Operation app", IsActive = true, CreatedBy = Guid.Empty, CreatedDate = DateTime.Now, CreatedByName = "System", UpdatedBy = Guid.Empty, UpdatedDate = DateTime.Now, UpdatedByName = "System", };
}
