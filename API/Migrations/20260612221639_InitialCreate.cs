using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StudyAreas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false, collation: "NOCASE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudyAreas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudyGoals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StudyAreaId = table.Column<int>(type: "INTEGER", nullable: true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false, collation: "NOCASE"),
                    Description = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true),
                    Priority = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    CompletedOn = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudyGoals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudyGoals_StudyAreas_StudyAreaId",
                        column: x => x.StudyAreaId,
                        principalTable: "StudyAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "StudySessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StudyGoalId = table.Column<int>(type: "INTEGER", nullable: false),
                    StudiedOn = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    DurationMinutes = table.Column<int>(type: "INTEGER", nullable: false),
                    LearningNote = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true),
                    FollowUpQuestions = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true),
                    FollowUpResponses = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudySessions", x => x.Id);
                    table.CheckConstraint("CK_StudySessions_DurationMinutes_Positive", "DurationMinutes > 0");
                    table.ForeignKey(
                        name: "FK_StudySessions_StudyGoals_StudyGoalId",
                        column: x => x.StudyGoalId,
                        principalTable: "StudyGoals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudyTargets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StudyGoalId = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Value = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudyTargets", x => x.Id);
                    table.CheckConstraint("CK_StudyTargets_Value_Positive", "Value > 0");
                    table.ForeignKey(
                        name: "FK_StudyTargets_StudyGoals_StudyGoalId",
                        column: x => x.StudyGoalId,
                        principalTable: "StudyGoals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudyAreas_Name",
                table: "StudyAreas",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudyGoals_Name",
                table: "StudyGoals",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudyGoals_StudyAreaId",
                table: "StudyGoals",
                column: "StudyAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_StudySessions_StudyGoalId",
                table: "StudySessions",
                column: "StudyGoalId");

            migrationBuilder.CreateIndex(
                name: "IX_StudyTargets_StudyGoalId_Type",
                table: "StudyTargets",
                columns: new[] { "StudyGoalId", "Type" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudySessions");

            migrationBuilder.DropTable(
                name: "StudyTargets");

            migrationBuilder.DropTable(
                name: "StudyGoals");

            migrationBuilder.DropTable(
                name: "StudyAreas");
        }
    }
}
