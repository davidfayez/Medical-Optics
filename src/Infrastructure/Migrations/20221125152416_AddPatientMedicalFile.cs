using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Optics.Infrastructure.Migrations
{
    public partial class AddPatientMedicalFile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PatientMedicalFile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_PatientMedicalFile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientMedicalFile_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientMedicalFile_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientMedicalFile_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientMedicalFile_CustomerData_ClientId",
                        column: x => x.ClientId,
                        principalTable: "CustomerData",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PatientComplaint",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitNo = table.Column<int>(type: "int", nullable: false),
                    ComplaintName = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    PatientMedicalFileId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_PatientComplaint", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientComplaint_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientComplaint_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientComplaint_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientComplaint_PatientMedicalFile_PatientMedicalFileId",
                        column: x => x.PatientMedicalFileId,
                        principalTable: "PatientMedicalFile",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PatientDiagnose",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitNo = table.Column<int>(type: "int", nullable: false),
                    PatientMedicalFileId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_PatientDiagnose", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientDiagnose_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientDiagnose_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientDiagnose_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientDiagnose_PatientMedicalFile_PatientMedicalFileId",
                        column: x => x.PatientMedicalFileId,
                        principalTable: "PatientMedicalFile",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PatientDiagnoseItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnoseTypeId = table.Column<int>(type: "int", nullable: false),
                    DiagnoseId = table.Column<int>(type: "int", nullable: false),
                    PatientDiagnoseId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_PatientDiagnoseItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientDiagnoseItem_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientDiagnoseItem_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientDiagnoseItem_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientDiagnoseItem_Diagnose_DiagnoseId",
                        column: x => x.DiagnoseId,
                        principalTable: "Diagnose",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientDiagnoseItem_PatientDiagnose_PatientDiagnoseId",
                        column: x => x.PatientDiagnoseId,
                        principalTable: "PatientDiagnose",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "9f4f27b8-6895-46b1-9668-1b305cfddcb1");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3039), new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3039) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(2826), new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(2826) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3023), new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3024) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3010), new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3002) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3071), new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3072) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3059), new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3059) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3088), new DateTime(2022, 11, 25, 17, 24, 15, 931, DateTimeKind.Local).AddTicks(3089) });

            migrationBuilder.CreateIndex(
                name: "IX_PatientComplaint_CreatedUserId",
                table: "PatientComplaint",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientComplaint_DeletedUserId",
                table: "PatientComplaint",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientComplaint_LastModifiedUserId",
                table: "PatientComplaint",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientComplaint_PatientMedicalFileId",
                table: "PatientComplaint",
                column: "PatientMedicalFileId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnose_CreatedUserId",
                table: "PatientDiagnose",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnose_DeletedUserId",
                table: "PatientDiagnose",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnose_LastModifiedUserId",
                table: "PatientDiagnose",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnose_PatientMedicalFileId",
                table: "PatientDiagnose",
                column: "PatientMedicalFileId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnoseItem_CreatedUserId",
                table: "PatientDiagnoseItem",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnoseItem_DeletedUserId",
                table: "PatientDiagnoseItem",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnoseItem_DiagnoseId",
                table: "PatientDiagnoseItem",
                column: "DiagnoseId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnoseItem_LastModifiedUserId",
                table: "PatientDiagnoseItem",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDiagnoseItem_PatientDiagnoseId",
                table: "PatientDiagnoseItem",
                column: "PatientDiagnoseId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMedicalFile_ClientId",
                table: "PatientMedicalFile",
                column: "ClientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PatientMedicalFile_CreatedUserId",
                table: "PatientMedicalFile",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMedicalFile_DeletedUserId",
                table: "PatientMedicalFile",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMedicalFile_LastModifiedUserId",
                table: "PatientMedicalFile",
                column: "LastModifiedUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientComplaint");

            migrationBuilder.DropTable(
                name: "PatientDiagnoseItem");

            migrationBuilder.DropTable(
                name: "PatientDiagnose");

            migrationBuilder.DropTable(
                name: "PatientMedicalFile");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "b5f4b56e-4096-47d5-99d0-35860396c4c9");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6046), new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6047) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(5717), new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(5718) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6013), new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6014) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(5993), new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(5985) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6129), new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6131) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6094), new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6095) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6159), new DateTime(2022, 10, 29, 15, 57, 0, 316, DateTimeKind.Local).AddTicks(6161) });
        }
    }
}
