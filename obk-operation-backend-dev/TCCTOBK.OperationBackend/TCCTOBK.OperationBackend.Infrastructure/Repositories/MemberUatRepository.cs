using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class MemberUatRepository : BaseRepository<trMemberUAT>, IMemberUatRepository
{
	public MemberUatRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public Task<trMemberUAT> GetAll()
	{
		var query = Db.AsQueryable();
		return query.FirstOrDefaultAsync()!;
	}
}
