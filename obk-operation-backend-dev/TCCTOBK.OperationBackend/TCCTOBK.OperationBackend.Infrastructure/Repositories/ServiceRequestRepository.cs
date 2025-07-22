using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Table;


namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class ServiceRequestRepository : BaseRepository<trServiceRequest>, IServiceRequestRepository
{

    public ServiceRequestRepository(ITCCTOBKContext context) : base(context)
    {
    }

    public async Task<trServiceRequest> GetByName(string name)
    {
        var query = Db.AsTracking();
        var result = await query.FirstOrDefaultAsync(x => x.Title == name);
        if (result == null) throw new NotFoundException("ไม่พบ SREvent");
        return result;
    }

    public Task<List<trServiceRequest>> Paginate(string? status, TableState state)
    {
        var query = GetAllQueryBuilder(status);
        // if (!string.IsNullOrEmpty(state.OrderingName))
        // {
        // 	query = query.OrderBy(state.OrderingName);
        // }
        return query.Skip(state.Skip).Take(state.Take).ToListAsync();
    }

    private IQueryable<trServiceRequest> GetAllQueryBuilder(string? status)
    {
        var query = Db.AsQueryable();
        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(x => x.Status == status);
        }
        query = query.OrderByDescending(x => x.UpdatedDate);
        return query;
    }

    public async Task Add(trServiceRequest serviceRequest)
    {
        await Db.AddAsync(serviceRequest);
        await Context.SaveChangesAsync();
    }

    public async Task Update(trServiceRequest serviceRequest)
    {
        var existingEntity = await Db.FirstOrDefaultAsync(x => x.Id == serviceRequest.Id);
        if (existingEntity == null) throw new NotFoundException("ไม่พบ SREvent");

        Context.Entry(existingEntity).CurrentValues.SetValues(serviceRequest);
        await Context.SaveChangesAsync();
    }
    public async Task<trServiceRequest> GetById(Guid id)
    {
        var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (result == null) throw new NotFoundException("ไม่พบ SREvent");
        return result;
    }

    public Task<int> GetCount(string? status)
    {
        var query = GetAllQueryBuilder(status);
        return query.CountAsync();
    }

}