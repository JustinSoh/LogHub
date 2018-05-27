using System.Diagnostics;
using System.ServiceProcess;
using System.Timers;
using System.Windows.Forms;

namespace LogHubEndpointLogsExtractionVer3
{
    public partial class Service1 : ServiceBase
    {
        private System.Timers.Timer timer1 = null;
        static PerformanceCounter cpuCounter;

        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            //Timer
            timer1 = new System.Timers.Timer();
            this.timer1.Interval = 30000; //Runs every 30 seconds
            this.timer1.Elapsed += new System.Timers.ElapsedEventHandler(this.timer1_Tick);
            timer1.Enabled = true;
            Library.WriteErrorLog("LogHub has started.");

        }

        protected override void OnStop()
        {
        }

        private void timer1_Tick(object sender, ElapsedEventArgs e)
        {
            Library.WriteErrorLog("\nBattery: " +getBatteryPercentage());
            Library.WriteErrorLog("\nCPU    : " + (string.Format("{0:N2}", getCpuUsage())));
            Library.WriteErrorLog("\nTimer ticked and logs have been sent successfully");
        }

        static float getCpuUsage()
        {
            cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            cpuCounter.NextValue();
            System.Threading.Thread.Sleep(1000);
            return cpuCounter.NextValue();
        }

        static string getBatteryPercentage()
        {
            PowerStatus p = SystemInformation.PowerStatus;
            int a = (int)(p.BatteryLifePercent * 100);
            return a.ToString();
        }

        // 24.5.18
        // Did functions to let LogHub log extraction to run on startup and getCpuUsage()
        // Next step is to make getCpuUsage() run every few seconds.

        // 26.5.18
        // Did getBatteryPercentage()
        // Next step is to make getBatteryPercentage() run every few seconds.

        // 27.5.18
        // Changed ConsoleApp to a Service.
        // Added a timer that will write to a log file every 30 seconds, called timer1_Tick
        // timer1_Tick will be updated in the future to send the logs over to Chester.
    }
}
