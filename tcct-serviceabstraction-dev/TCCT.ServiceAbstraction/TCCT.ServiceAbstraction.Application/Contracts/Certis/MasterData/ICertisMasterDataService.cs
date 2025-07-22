namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
public interface ICertisMasterDataService
{
	ICertisMasterDataAssetService Asset { get; }
	ICertisMasterDataLocationService Location { get; }
	ICertisMasterDataCWOService CWO { get; }
	ICertisMasterDataFMRelatedService FMRelated { get; }
	ICertisMasterDataPPMService PPM { get; }
	ICertisMasterDataOtherService Other { get; }
}
