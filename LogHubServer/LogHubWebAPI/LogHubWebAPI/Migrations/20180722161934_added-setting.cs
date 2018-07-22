using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace LogHubWebAPI.Migrations
{
    public partial class addedsetting : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.RenameColumn(
                name: "UserSettingId",
                table: "Users",
                newName: "BandwidthSetting");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BandwidthSetting",
                table: "Users",
                newName: "UserSettingId");

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    SettingId = table.Column<string>(nullable: false),
                    BandwidthThreshold = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.SettingId);
                    table.ForeignKey(
                        name: "FK_UserSettings_Users_SettingId",
                        column: x => x.SettingId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
