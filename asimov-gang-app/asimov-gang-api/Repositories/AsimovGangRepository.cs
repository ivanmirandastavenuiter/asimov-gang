using asimov_gang_api.Models;
using asimov_gang_api.Repositories.Contracts;
using Microsoft.EntityFrameworkCore;

namespace asimov_gang_api.Repositories
{
    public class AsimovGangRepository : IAsimovGangRepository
    {
        public AsimovGangRepository() {}

        public List<RobotStatistics> GetExecutionData()
        {
            using (var context = new AsimovDbContext())
            {
                var list = context.Statistics.ToList();

                return list;
            }
        }

        public bool SaveRobotStatistics(RobotStatistics robotStatistics)
        {
            using (var context = new AsimovDbContext())
            {
                context.Statistics.Add(robotStatistics);
                context.SaveChanges();
            }
            return true;
        }
    }
}
