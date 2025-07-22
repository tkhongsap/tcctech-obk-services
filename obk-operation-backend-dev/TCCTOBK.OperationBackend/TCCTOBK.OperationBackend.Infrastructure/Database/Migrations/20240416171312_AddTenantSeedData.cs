using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Tenant",
                columns: new[] { "TID", "CreatedBy", "CreatedByName", "CreatedDate", "IsActive", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate", "description" },
                values: new object[,]
                {
                    { new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 4, 17, 0, 13, 11, 544, DateTimeKind.Local).AddTicks(6193), true, "OBK CMS", "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3313), "One bangkok CMS" },
                    { new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3985), true, "Operation app", "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3990), "Operation app" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"));

            migrationBuilder.DeleteData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"));
        }
    }
}
