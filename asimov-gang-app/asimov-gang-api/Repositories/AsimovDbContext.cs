using asimov_gang_api.Models;
using Microsoft.EntityFrameworkCore;

namespace asimov_gang_api.Repositories
{
    public class AsimovDbContext : DbContext
    {
        protected override void OnConfiguring
        (DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseInMemoryDatabase(databaseName: "AsimovGangDb");
        }
        public DbSet<RobotStatistics> Statistics { get; set; }
    }
}
