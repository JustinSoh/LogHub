using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Win32;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;


namespace LogHubEndpointLogsExtractionVer2
{
    class Program
    {

        static PerformanceCounter cpuCounter;

        static void Main(string[] args)
        {
            //Enables LogHub to start logging data on startup
            enableToRunOnStartup();

            //Temporary line that writes CPU usage to a text file
            File.WriteAllText(@"C:\\Users\\SengokuMedaru\\Desktop\\WriteLineTest.txt", string.Format("{0:N2}", getCpuUsage()));

            //Temporary line that writes Battery percentage to a text file
            File.WriteAllText(@"C:\\Users\\SengokuMedaru\\Desktop\\WriteLineTest.txt", getBatteryPercentage());

        }

        static void enableToRunOnStartup()
        {
            RegistryKey reg = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);
            reg.SetValue("LogHub", System.Reflection.Assembly.GetExecutingAssembly().Location);
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
    }

    // 24.5.18
    // Did functions to let LogHub log extraction to run on startup and getCpuUsage()
    // Next step is to make getCpuUsage() run every few seconds.

    // 26.5.18
    // Did getBatteryPercentage()
    // Next step is to make getBatteryPercentage() run every few seconds.
}
