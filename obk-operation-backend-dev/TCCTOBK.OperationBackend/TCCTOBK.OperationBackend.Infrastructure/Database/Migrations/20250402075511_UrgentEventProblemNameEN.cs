using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UrgentEventProblemNameEN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "mtSRProblem",
                newName: "Name_th");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "mtSREvent",
                newName: "Name_th");

            migrationBuilder.AddColumn<string>(
                name: "Name_en",
                table: "mtSRProblem",
                type: "character varying",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name_en",
                table: "mtSREvent",
                type: "character varying",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name_en",
                table: "mtSRProblem");

            migrationBuilder.DropColumn(
                name: "Name_en",
                table: "mtSREvent");

            migrationBuilder.RenameColumn(
                name: "Name_th",
                table: "mtSRProblem",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Name_th",
                table: "mtSREvent",
                newName: "Name");
        }
    }
}
