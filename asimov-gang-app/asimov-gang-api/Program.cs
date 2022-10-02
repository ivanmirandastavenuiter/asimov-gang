using asimov_gang_api.Contracts;
using asimov_gang_api.Controllers.Validations;
using asimov_gang_api.Repositories;
using asimov_gang_api.Repositories.Contracts;
using asimov_gang_api.Services;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IAsimovGangRepository, AsimovGangRepository>();
builder.Services.AddScoped<IAsimovGangService, AsimovGangService>();

builder.Services.AddScoped<IValidator<MoveForwardRequest>, MoveForwardValidator>();
builder.Services.AddScoped<IValidator<MoveToSideRequest>, MoveToSideValidator>();
builder.Services.AddScoped<IValidator<SaveRobotOutputRequest>, SaveRobotOutputValidator>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:4200")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.UseCors();

app.Run();
