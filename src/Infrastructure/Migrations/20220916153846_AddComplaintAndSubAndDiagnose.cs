using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Optics.Infrastructure.Migrations
{
    public partial class AddComplaintAndSubAndDiagnose : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Complaint",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplaintCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ComplaintNameAr = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    ComplaintNameEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    ComplaintImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
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
                    table.PrimaryKey("PK_Complaint", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Complaint_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Complaint_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Complaint_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Diagnose",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnoseCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DiagnoseNameAr = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DiagnoseNameEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
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
                    table.PrimaryKey("PK_Diagnose", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Diagnose_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Diagnose_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Diagnose_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SubComplaint",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplaintId = table.Column<int>(type: "int", nullable: false),
                    SubComplaintCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    SubComplaintNameAr = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    SubComplaintNameEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    SubComplaintPhotoPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
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
                    table.PrimaryKey("PK_SubComplaint", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubComplaint_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SubComplaint_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SubComplaint_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SubComplaint_Complaint_ComplaintId",
                        column: x => x.ComplaintId,
                        principalTable: "Complaint",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "fe18d078-f0b1-44f7-bdb4-7b573409f157");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6906), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6907) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6696), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6697) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6891), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6891) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6874), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6870) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6945), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6946) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6935), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6935) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6957), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6957) });

            migrationBuilder.CreateIndex(
                name: "IX_Complaint_CreatedUserId",
                table: "Complaint",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Complaint_DeletedUserId",
                table: "Complaint",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Complaint_LastModifiedUserId",
                table: "Complaint",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnose_CreatedUserId",
                table: "Diagnose",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnose_DeletedUserId",
                table: "Diagnose",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Diagnose_LastModifiedUserId",
                table: "Diagnose",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubComplaint_ComplaintId",
                table: "SubComplaint",
                column: "ComplaintId");

            migrationBuilder.CreateIndex(
                name: "IX_SubComplaint_CreatedUserId",
                table: "SubComplaint",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubComplaint_DeletedUserId",
                table: "SubComplaint",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubComplaint_LastModifiedUserId",
                table: "SubComplaint",
                column: "LastModifiedUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Diagnose");

            migrationBuilder.DropTable(
                name: "SubComplaint");

            migrationBuilder.DropTable(
                name: "Complaint");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "25412697-424a-47c2-b9f5-564376791d6f");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6448), new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6448) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6227), new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6227) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6429), new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6429) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6395), new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6390) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6489), new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6489) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6478), new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6479) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6500), new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6501) });
        }
    }
}
