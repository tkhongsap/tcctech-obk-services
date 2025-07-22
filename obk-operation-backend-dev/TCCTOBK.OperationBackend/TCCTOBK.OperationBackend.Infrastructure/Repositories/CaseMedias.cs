using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class CaseMediasRepository : BaseRepository<trCaseMedias>, ICaseMediasRepository
{
	public CaseMediasRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public async Task<Guid> CreateCaseMedias(CreateCaseMediasModel media)
	{
		var newCaseMediasId = Guid.NewGuid();
		var newCaseMedias = new trCaseMedias()
		{
			Id = media.Id,
			CaseId = media.CaseId,
			FileName = media.FileName,
			Data = media.Data,
			MimeType = media.MimeType
		};
		Db.Add(newCaseMedias);
		return newCaseMediasId;
	}
	public async Task<int> RemoveCaseMedias(int caseId)
	{
		return await Db.Where(x => x.CaseId == caseId).ExecuteDeleteAsync();
	}
}
