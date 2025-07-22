using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Table;


namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class SREventRepository : BaseRepository<mtSREvent>, ISREventRepository
{

    public SREventRepository(ITCCTOBKContext context) : base(context)
    {
    }

    public async Task<mtSREvent> GetByName(string name)
    {
        var query = Db.AsTracking();
        var result = await query.FirstOrDefaultAsync(x => x.Name_th == name && x.Name_th == name);
        if (result == null) throw new NotFoundException("ไม่พบ SREvent");
        return result;
    }
    public Task<List<mtSREvent>> Paginate(TableState state)
    {
        var query = GetAllQueryBuilder();
        // if (!string.IsNullOrEmpty(state.OrderingName))
        // {
        // 	query = query.OrderBy(state.OrderingName);
        // }
        return query.Skip(state.Skip).Take(state.Take).ToListAsync();
    }

    private IQueryable<mtSREvent> GetAllQueryBuilder()
    {
        var query = Db.AsQueryable();
        return query;
    }

    public async Task Add(mtSREvent entity)
    {
        await Db.AddAsync(entity);
        await Context.SaveChangesAsync();
    }

    public async Task<List<mtSREvent>> GetFromList(List<Guid> names)
    {
        var query = Db.AsQueryable();
        var results = await query.Where(x => names.Contains(x.Id)).ToListAsync();
        return results;
    }
	
}