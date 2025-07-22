using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyHidden;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeHidden;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public partial class CertisTransactionDMSService : ICertisTransactionDMSService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionDMSService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public Task<DmsImageByIdResult> GetDMSImageById(int id)
	{
		return _endpointprovider.GetDmsImageByIdResult(id);
	}

	public Task<DmsDetailByIdResult> GetDmsDetailById(int id)
	{
		return _endpointprovider.GetDmsDetailByIdResult(id);
	}

	public Task<List<DmsByObjectTypeAndKeyHiddenResult>> GetDMSHiddenById(string objectType, int objectKey)
	{
		return _endpointprovider.GetDmsByObjectTypeAndKeyHidden(objectType, objectKey);
	}

	public Task<DocumentManagementResult> PostDocumentManagement(int objectKey, string objectType, string description, string searchTags, string attachmentType, string isDefault, string isHidden, IFormFile image)
	{
		return _endpointprovider.UploadDMS(objectKey, objectType, description, searchTags, attachmentType, isDefault, isHidden, image);
	}
	public Task<List<DmsByObjectTypeHiddenResult>> DmsByObjectTypeHidden(string objectType)
	{
		return _endpointprovider.GetDmsByObjectTypeHidden(objectType);
	}
	public Task<List<DmsByObjectTypeAndKeyHiddenResult>> DmsByObjectTypeAndKeyHidden(string objectType, int objectKey)
	{
		return _endpointprovider.GetDmsByObjectTypeAndKeyHidden(objectType, objectKey);
	}
}
