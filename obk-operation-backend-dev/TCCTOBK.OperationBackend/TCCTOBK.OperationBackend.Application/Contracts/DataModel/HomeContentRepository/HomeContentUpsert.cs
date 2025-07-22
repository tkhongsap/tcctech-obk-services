namespace TCCTOBK.OperationBackend.Application;

public class HomeContentUpsert
{
	public int Version { get; set; }
	public string ImageURL { get; set; } = default!;
	public bool IsVisible { get; set; }
	public string? Note { get; set; }
	public string RemoteConfigDataJson { get; set; } = default!;
	public string RemoteConfigResponseDataJson { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string OriginalFileName { get; set; } = default!;

	public HomeContentUpsert(int version, string imageurl, bool isvisible, string? note, string remoteconfigdatajson, string remoteconfigresponsedatajson, string fileName, string originalFileName)
	{
		Version = version;
		ImageURL = imageurl;
		IsVisible = isvisible;
		Note = note;
		RemoteConfigDataJson = remoteconfigdatajson;
		RemoteConfigResponseDataJson = remoteconfigresponsedatajson;
		FileName = fileName;
		OriginalFileName = originalFileName;
	}
}
