using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyHidden;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeHidden;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
public interface ICertisTransactionDMSService
{
	Task<DocumentManagementResult> PostDocumentManagement(int objectKey, string objectType, string description, string searchTags, string attachmentType, string isDefault, string isHidden, IFormFile image);
	Task<DmsImageByIdResult> GetDMSImageById(int id);
	Task<DmsDetailByIdResult> GetDmsDetailById(int id);
	Task<List<DmsByObjectTypeAndKeyHiddenResult>> GetDMSHiddenById(string objectType, int objectKey);
	Task<List<DmsByObjectTypeHiddenResult>> DmsByObjectTypeHidden(string objectType);
}
