using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Table;


namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class SRProblemRepository : BaseRepository<mtSRProblem>, ISRProblemRepository
{

    public SRProblemRepository(ITCCTOBKContext context) : base(context)
    {
    }

    public async Task<mtSRProblem> GetByName(string name)
    {
        var query = Db.AsTracking();
        var result = await query.FirstOrDefaultAsync(x => x.Name_th == name && x.Name_en == name);
        if (result == null) throw new NotFoundException("ไม่พบ mtSRProblem");
        return result;
    }
    
        public async Task<List<mtSRProblem>> GetFromList(List<Guid> names)
    {
        var query = Db.AsQueryable();
        var results = await query.Where(x => names.Contains(x.Id)).ToListAsync();
        return results;
    }
	

	public Task<List<mtSRProblem>> Paginate(TableState state)
	{
		var query = GetAllQueryBuilder();
		// if (!string.IsNullOrEmpty(state.OrderingName))
		// {
		// 	query = query.OrderBy(state.OrderingName);
		// }
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<mtSRProblem> GetAllQueryBuilder()
	{
		var query = Db.AsQueryable();
		return query;
	}

	public async Task Add(mtSRProblem entity)
	{
		await Db.AddAsync(entity);
		await Context.SaveChangesAsync();
	}

}