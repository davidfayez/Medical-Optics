using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Optics.Infrastructure.Migrations
{
    public partial class AddFavoriteTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavoriteDiagnosis");

            migrationBuilder.CreateTable(
                name: "FavoriteComplaintItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplaintId = table.Column<int>(type: "int", nullable: false),
                    FavoriteComplaintId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteComplaintItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteComplaintItem_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteComplaintItem_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteComplaintItem_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteComplaintItem_Complaint_ComplaintId",
                        column: x => x.ComplaintId,
                        principalTable: "Complaint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FavoriteComplaintItem_FavoriteComplaint_FavoriteComplaintId",
                        column: x => x.FavoriteComplaintId,
                        principalTable: "FavoriteComplaint",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FavoriteDiagnose",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FavoriteName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteDiagnose", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnose_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnose_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnose_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FavoriteDiagnoseItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnoseId = table.Column<int>(type: "int", nullable: false),
                    FavoriteDiagnoseId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteDiagnoseItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnoseItem_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnoseItem_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnoseItem_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnoseItem_Diagnose_DiagnoseId",
                        column: x => x.DiagnoseId,
                        principalTable: "Diagnose",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnoseItem_FavoriteDiagnose_FavoriteDiagnoseId",
                        column: x => x.FavoriteDiagnoseId,
                        principalTable: "FavoriteDiagnose",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "31951e95-3343-447b-b7ca-6774f0587b45");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(216), new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(217) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 27, 18, 36, 8, 12, DateTimeKind.Local).AddTicks(9968), new DateTime(2022, 10, 27, 18, 36, 8, 12, DateTimeKind.Local).AddTicks(9968) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(186), new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(187) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(169), new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(162) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(271), new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(272) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(251), new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(252) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(285), new DateTime(2022, 10, 27, 18, 36, 8, 13, DateTimeKind.Local).AddTicks(286) });

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaintItem_ComplaintId",
                table: "FavoriteComplaintItem",
                column: "ComplaintId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaintItem_CreatedUserId",
                table: "FavoriteComplaintItem",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaintItem_DeletedUserId",
                table: "FavoriteComplaintItem",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaintItem_FavoriteComplaintId",
                table: "FavoriteComplaintItem",
                column: "FavoriteComplaintId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaintItem_LastModifiedUserId",
                table: "FavoriteComplaintItem",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnose_CreatedUserId",
                table: "FavoriteDiagnose",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnose_DeletedUserId",
                table: "FavoriteDiagnose",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnose_LastModifiedUserId",
                table: "FavoriteDiagnose",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnoseItem_CreatedUserId",
                table: "FavoriteDiagnoseItem",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnoseItem_DeletedUserId",
                table: "FavoriteDiagnoseItem",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnoseItem_DiagnoseId",
                table: "FavoriteDiagnoseItem",
                column: "DiagnoseId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnoseItem_FavoriteDiagnoseId",
                table: "FavoriteDiagnoseItem",
                column: "FavoriteDiagnoseId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnoseItem_LastModifiedUserId",
                table: "FavoriteDiagnoseItem",
                column: "LastModifiedUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavoriteComplaintItem");

            migrationBuilder.DropTable(
                name: "FavoriteDiagnoseItem");

            migrationBuilder.DropTable(
                name: "FavoriteDiagnose");

            migrationBuilder.CreateTable(
                name: "FavoriteDiagnosis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FavoriteName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteDiagnosis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnosis_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnosis_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnosis_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "36131156-571f-4d76-ac98-a9657af0a1a2");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6341), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6342) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6154), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6155) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6325), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6326) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6312), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6308) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6379), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6379) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6364), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6364) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6393), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6394) });

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnosis_CreatedUserId",
                table: "FavoriteDiagnosis",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnosis_DeletedUserId",
                table: "FavoriteDiagnosis",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnosis_LastModifiedUserId",
                table: "FavoriteDiagnosis",
                column: "LastModifiedUserId");
        }
    }
}
