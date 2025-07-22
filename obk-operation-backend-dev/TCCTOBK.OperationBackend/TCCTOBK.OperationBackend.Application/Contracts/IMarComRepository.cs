using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetAllExplore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetExplore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllCategory;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllContent;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetHappening;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetAll;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IMarcomRepository
{
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> DeletePRBanner(DeleteBannerMarcom data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> UpdatePRBanner(MarcomManagementDataModel data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<MarcomBannerResult> GetAllPRBanner(string? filter, int? status, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <returns></returns>
	Task<GetInitialMarcomBannerResult> GetInitialBanner();
	/// <summary>
	/// 
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	Task<GetMarcomBannerManagementResult> GetPRBannerById(Guid id);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="order"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<object> ChangeOrder(ChangeOrderSustainability order, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<EventResult> GetAllEvent(string? filter, int? status, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	Task<GetEventResult> GetEventById(Guid id);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> DeleteEvent(DeleteEvent data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> UpdateEvent(EventDataModel data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> UpdateExplore(ExploreDataModel data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<ExploreResult> GetAllExplore(string? filter, int? status, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	Task<GetExploreResult> GetExploreById(Guid id);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> DeleteExplore(DeleteEvent data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> UpdateHappening(HappeningDataModel data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<CategoryResult> GetAllCategory(string? filter, int? status, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	Task<GetHappeningResult> GetHappeningById(Guid id);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="filter"></param>
	/// <param name="status"></param>
	/// <param name="parentID"></param>
	/// <param name="state"></param>
	/// <returns></returns>
	Task<ContentResult> GetAllContent(string? filter, int? status, Guid? parentID, bool? isPin, TableState state);
	/// <summary>
	/// 
	/// </summary>
	/// <returns></returns>
	Task<CategoryListResult> GetCategory(Guid? id);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<Guid> DeleteHappening(DeleteExplore data, AuditableModel auditable);
	/// <summary>
	/// 
	/// </summary>
	/// <param name="data"></param>
	/// <param name="auditable"></param>
	/// <returns></returns>
	Task<object> UpdateConfig(ConfigMarcom data, AuditableModel auditable);
}