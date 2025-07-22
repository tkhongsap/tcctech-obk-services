namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
public class DmsImageByIdResult
{
	public byte[] Image { get; set; }

	public DmsImageByIdResult(byte[] image) { Image = image; }
}
