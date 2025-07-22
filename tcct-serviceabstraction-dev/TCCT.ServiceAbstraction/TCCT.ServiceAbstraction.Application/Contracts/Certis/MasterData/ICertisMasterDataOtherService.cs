using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.AttachmentTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.Users;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
public interface ICertisMasterDataOtherService
{
	Task<List<AttachmentTypeResult>> GetAttachmentTypes();
	Task<List<UsersResult>> GetUsers();
}
