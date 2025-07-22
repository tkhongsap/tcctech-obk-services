using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IMarcomMobileRepository
{
	Task<List<trMarcomCMSExplore>> GetExploreAll();
	Task<List<trMarcomCMSExploreContent>> GetExploreContentAll();
	Task<List<trMarcomCMSTag>> GetTagAll();
	Task<List<trMarcomCMSWhatHappenCategory>> GetWhatHappenCategoryAll();
	Task<List<trMarcomCMSWhatHappenContent>> GetWhatHappenContentAll();
	Task<List<trMarcomCMSWhatHappenSub>> GetWhatHappenSubAll();
	Task<List<trMarcomPRBanner>> GetPRBannerAll();
	Task<List<trMarcomSpecialEvent>> GetSpecialEventAll();
	Task<List<trMarcomConfig>> GetConfigAll();
}