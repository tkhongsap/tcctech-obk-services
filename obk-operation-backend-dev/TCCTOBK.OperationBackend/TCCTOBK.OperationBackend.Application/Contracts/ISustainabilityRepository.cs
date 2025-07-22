using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface ISustainabilityRepository
{
	/// <summary>
	/// Create Banner
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<List<Guid>> UpdateBanner(List<BannerSustainability> data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <returns></returns>
	Task<List<trSustainabilityBanner>> GetAllBanner();
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> DeleteDigitalLibrary(DeleteDigitalSustainability data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> UpdateDigitalLibrary(DigitalSustainability data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="dlid"></param>
	/// <returns></returns>
	Task<DigitalLibraryByIdResult> GetDigitalLibraryById(Guid dlid);
	/// <summary>
	/// 
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<DigitalResult> GetAllDigitalLibrary(string? filter, int? status, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <returns></returns>
	Task<int> DigitalLibraryCount(string? filter, int? status);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> DeleteContentManagement(DeleteContentManagementSustainability data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> UpdateContentManagement(ContentManagementSustainability data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="cmsid"></param>
	/// <returns></returns>
	Task<GetContentManagementResult> GetCMSById(Guid cmsid);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<CmsResult> GetAllCMS(string? filter, int? status, Guid? parentID, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="order"></param>
	/// <param name="auditable"></param>
	Task<object> ChangeOrder(ChangeOrderSustainability order, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> DeletePRBanner(DeleteBannerSustainability data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> UpdatePRBanner(PRBannerManagementSustainability data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	Task<GetPRBannerManagementResult> GetPRBannerById(Guid id);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<PRBannerResult> GetAllPRBanner(string? filter, int? status, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <returns></returns>
	Task<MainContentManagementResult> GetCMSMenu();
	/// <summary>
	/// 
	/// </summary>
	/// <returns></returns>
	Task<GetInitialPRBannerResult> GetInitialBanner();
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<object> UpdateConfig(ConfigSustainability data, AuditableModel auditable);
}