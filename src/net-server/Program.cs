var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    // Look for static files in dist
    WebRootPath = "dist"
});

var app = builder.Build();
app.Run();
