using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.File.Command.Upload;

public class UploadCommandHandler : ICommandHandler<UploadCommand, UploadResult>
{
	public Task<UploadResult> Handle(UploadCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
