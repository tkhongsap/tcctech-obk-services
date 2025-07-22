using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.AttachmentTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.Users;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
public partial class CertisMasterDataOtherService : ICertisMasterDataOtherService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisMasterDataOtherService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public async Task<List<AttachmentTypeResult>> GetAttachmentTypes()
	{
		return await _endpointprovider.GetAttachmentTypes();
	}

	public async Task<List<UsersResult>> GetUsers()
	{
		return await _endpointprovider.GetUsers();
	}
}
