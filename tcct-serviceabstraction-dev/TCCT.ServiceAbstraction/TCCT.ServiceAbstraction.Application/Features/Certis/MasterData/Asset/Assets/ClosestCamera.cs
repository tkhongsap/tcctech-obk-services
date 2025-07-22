namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;
public class ClosestCamera
{
	public int SeqNo { get; set; }
	public int CameraId { get; set; }
	public bool IsPrimaryCamera { get; set; }
	public bool IsSnapshotEnable { get; set; }
	public bool IsFootageEnable { get; set; }
}
