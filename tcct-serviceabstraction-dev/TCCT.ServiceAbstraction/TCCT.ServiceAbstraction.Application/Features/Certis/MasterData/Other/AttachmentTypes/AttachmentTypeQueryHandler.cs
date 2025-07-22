using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.AttachmentTypes;
public class AttachmentTypeQueryHandler : IQueryHandler<AttachmentTypeQuery, List<AttachmentTypeResult>>
{
	private readonly ICertisService _certisservice;
	public AttachmentTypeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<AttachmentTypeResult>> Handle(AttachmentTypeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Other.GetAttachmentTypes();
		return res;
	}
}
