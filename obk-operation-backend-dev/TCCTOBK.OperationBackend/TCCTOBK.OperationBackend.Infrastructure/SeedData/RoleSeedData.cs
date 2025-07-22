using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure;

public static class RoleSeedData
{
	public static trRole TechnicianRole = new trRole
	{
		RID = Constant.TECHNICIAN_ROLE_ID,
		Name = "Technician",
		Description = "Technician",
		IsActive = true,
		IsDelete = false,
		TID = Constant.TENANT_OPERATION_APP_ID,
		CreatedBy = Guid.Empty,
		CreatedDate = DateTime.Now,
		CreatedByName = "System",
		UpdatedBy = Guid.Empty,
		UpdatedDate = DateTime.Now,
		UpdatedByName = "System",
	};

	public static trRole CleaningRole = new trRole
	{
		RID = Constant.CLEANING_ROLE_ID,
		Name = "Cleaning",
		Description = "Cleaning",
		IsActive = true,
		IsDelete = false,
		TID = Constant.TENANT_OPERATION_APP_ID,
		CreatedBy = Guid.Empty,
		CreatedDate = DateTime.Now,
		CreatedByName = "System",
		UpdatedBy = Guid.Empty,
		UpdatedDate = DateTime.Now,
		UpdatedByName = "System",
	};

	public static trRole SupervisorRole = new trRole
	{
		RID = Constant.SUPERVISOR_ROLE_ID,
		Name = "Supervisor",
		Description = "Supervisor",
		IsActive = true,
		IsDelete = false,
		TID = Constant.TENANT_OPERATION_APP_ID,
		CreatedBy = Guid.Empty,
		CreatedDate = DateTime.Now,
		CreatedByName = "System",
		UpdatedBy = Guid.Empty,
		UpdatedDate = DateTime.Now,
		UpdatedByName = "System",
	};

	public static trRole GuardRole = new trRole
	{
		RID = Constant.GUARD_ROLE_ID,
		Name = "Guard",
		Description = "Guard",
		IsActive = true,
		IsDelete = false,
		TID = Constant.TENANT_OPERATION_APP_ID,
		CreatedBy = Guid.Empty,
		CreatedDate = DateTime.Now,
		CreatedByName = "System",
		UpdatedBy = Guid.Empty,
		UpdatedDate = DateTime.Now,
		UpdatedByName = "System",
	};

	public static trRole DCCRole = new trRole
	{
		RID = Constant.DCC_ROLE_ID,
		Name = "Dcc",
		Description = "Dcc",
		IsActive = true,
		IsDelete = false,
		TID = Constant.TENANT_OPERATION_APP_ID,
		CreatedBy = Guid.Empty,
		CreatedDate = DateTime.Now,
		CreatedByName = "System",
		UpdatedBy = Guid.Empty,
		UpdatedDate = DateTime.Now,
		UpdatedByName = "System",
	};

	public static trRole FMCManagerRole = new trRole
	{
		RID = Constant.FMC_MANAGER_ROLE_ID,
		Name = "FMC manager",
		Description = "FMC manager",
		IsActive = true,
		IsDelete = false,
		TID = Constant.TENANT_OPERATION_APP_ID,
		CreatedBy = Guid.Empty,
		CreatedDate = DateTime.Now,
		CreatedByName = "System",
		UpdatedBy = Guid.Empty,
		UpdatedDate = DateTime.Now,
		UpdatedByName = "System",
	};

	public static trRole SOCManagerRole = new trRole
	{
		RID = Constant.SOC_MANAGER_ROLE_ID,
		Name = "SOC manager",
		Description = "SOC manager",
		IsActive = true,
		IsDelete = false,
		TID = Constant.TENANT_OPERATION_APP_ID,
		CreatedBy = Guid.Empty,
		CreatedDate = DateTime.Now,
		CreatedByName = "System",
		UpdatedBy = Guid.Empty,
		UpdatedDate = DateTime.Now,
		UpdatedByName = "System",
	};

	public static List<trRole> Data = new List<trRole> { TechnicianRole, CleaningRole, SupervisorRole, DCCRole, FMCManagerRole, SOCManagerRole };
}
