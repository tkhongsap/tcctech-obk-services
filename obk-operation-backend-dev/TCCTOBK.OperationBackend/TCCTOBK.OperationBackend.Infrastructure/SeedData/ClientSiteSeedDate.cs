using System;
using NPOI.SS.Formula.Functions;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ClientSiteSeedDate
{

    public static List<ClientSite> GenerateClientSite()
    {
        var listClientSite = new List<ClientSite>();
        listClientSite.Add(new ClientSite
        {
            CSID = new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
            Name = "One Bangkok",
        });
        listClientSite.Add(new ClientSite
        {
            CSID = new Guid("9b84961b-1de6-445b-bd19-12430950d226"),
            Name = "The Parq",
        });
        return listClientSite;
    }
};