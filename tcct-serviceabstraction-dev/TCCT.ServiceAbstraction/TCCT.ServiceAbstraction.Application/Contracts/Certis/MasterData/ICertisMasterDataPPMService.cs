using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.DefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.FrequencyTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.StatusCodes;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
public interface ICertisMasterDataPPMService
{
	// PPM - Plan and Preventive Maintainance
	Task<List<FrequencyTypeResult>> GetFrequencyTypes();
	Task<List<StatusCodesResult>> GetStatusCodes();
	Task<PPMDefaultConfigResult> GetPPMDefaultConfig();
}
