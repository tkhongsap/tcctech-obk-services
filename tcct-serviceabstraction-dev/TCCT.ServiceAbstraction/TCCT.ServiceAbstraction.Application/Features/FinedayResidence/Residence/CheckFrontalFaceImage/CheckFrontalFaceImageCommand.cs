using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckFrontalFaceImage;
public class CheckFrontalFaceImageCommand : ICommand<CheckFrontalFaceImageResult>
{
	public string Base64 { get; set; }
	public string FilesName { get; set; }

	public CheckFrontalFaceImageCommand(string base64, string filesName)
	{
		Base64 = base64;
		FilesName = filesName;
	}
}
