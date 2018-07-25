using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace LogHubWebAPI.Migrations
{
    public partial class addedBandwidth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OverallBandwidth",
                columns: table => new
                {
                    OverallBandwidthId = table.Column<string>(nullable: false),
                    Bandwith = table.Column<string>(nullable: true),
                    Included = table.Column<bool>(nullable: false),
                    Time = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OverallBandwidth", x => x.OverallBandwidthId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OverallBandwidth");
        }
    }
}
