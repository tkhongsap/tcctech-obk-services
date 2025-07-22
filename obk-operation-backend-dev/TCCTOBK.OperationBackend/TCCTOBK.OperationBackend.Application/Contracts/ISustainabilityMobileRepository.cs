using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface ISustainabilityMobileRepository
{
	Task<List<trSustainabilityBanner>> GetBannerAll();
	Task<List<trSustainabilityPRBanner>> GetPRBannerAll();
	Task<List<trSustainabilityCMS>> GetCMSAll();
	Task<List<trSustainabilityCMSContent>> GetCMSContentAll();
	Task<List<trSustainabilityLibrary>> GetDigitalLibraryAll();
	Task<List<trSustainabilityLibraryFile>> GetDigitalLibraryFileAll();
	Task<List<trSustainabilityConfig>> GetConfigAll();
}