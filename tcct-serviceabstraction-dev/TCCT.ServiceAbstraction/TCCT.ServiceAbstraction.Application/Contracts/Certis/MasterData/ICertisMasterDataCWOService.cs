using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWODefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOStatusCode;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOType;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
public interface ICertisMasterDataCWOService
{
	// CWO - Corrective Work Order
	Task<List<CWOTypeResult>> GetCwoTypes();
	Task<List<CWOStatusCodeResult>> GetCwoStatusCodes();
	Task<CWODefaultConfigResult> GetCwoDefaultConfig();
}
