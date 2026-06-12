using API.Data;
using API.Endpoints;
using API.Services.StudyAreas;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<StudyPalDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("StudyPal")));
builder.Services.AddScoped<IStudyAreaService, StudyAreaService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/health", () => Results.Ok(new { Status = "Healthy" }))
    .WithName("GetHealth");
app.MapStudyAreaEndpoints();

app.Run();
