using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Security.Permissions;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using System.Windows.Forms;

namespace LogHubEndpointLogsExtractionVer3
{
    public partial class Service1 : ServiceBase
    {
        private System.Timers.Timer timer1 = null;
        FileSystemWatcher watcher;
        static AutoResetEvent signal;

        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            //Logs that do not come every 30 seconds
            trackFileSystemChanges();
            watcher.EnableRaisingEvents = true;
            getEventLogs();

            //Logs that come every 30 seconds
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
            Library.WriteErrorLog("Battery{" + getBatteryPercentage() + "}");
            Library.WriteErrorLog(getCpuUsage());
            Library.WriteErrorLog("Timer ticked and logs have been sent successfully");
        }

        static string getBatteryPercentage()
        {
            PowerStatus p = SystemInformation.PowerStatus;
            int a = (int)(p.BatteryLifePercent * 100);
            return a.ToString();
        }

        static string getCpuUsage()
        {
            Process[] processes = Process.GetProcesses();
            string stringsOfCpu = "";

            var counters = new List<PerformanceCounter>();

            foreach (Process process in processes)
            {
                var counter = new PerformanceCounter("Process", "% Processor Time", process.ProcessName);
                counter.NextValue();
                counters.Add(counter);
            }

            int i = 0;

            int processorCount = Environment.ProcessorCount;

            foreach (var counter in counters)
            {
                stringsOfCpu += (processes[i].ProcessName + "(" + +processes[i].Id +"): " + (Math.Round(counter.NextValue(), 1) / processorCount) + ";\n");
                ++i;   
            }

            return "CPU{" + stringsOfCpu+"}";
        }

        static void getEventLogs()
        {
            EventLog mySecurityLog = new EventLog("Security");
            mySecurityLog.EntryWritten += new EntryWrittenEventHandler(onSecurityEntryWritten);
            mySecurityLog.EnableRaisingEvents = true;

            EventLog mySystemLog = new EventLog("System");
            mySystemLog.EntryWritten += new EntryWrittenEventHandler(onSystemEntryWritten);
            mySystemLog.EnableRaisingEvents = true;
        }

        private static void onSecurityEntryWritten(object source, EntryWrittenEventArgs e)
        {
            string watchLog = "Security";
            string logName = watchLog;
            int e1 = 0;
            EventLog log = new EventLog(logName);
            e1 = log.Entries.Count - 1; // last entry

            string logType = Convert.ToString(log.Entries[e1].EntryType);
            string logCategory = Convert.ToString(log.Entries[e1].Category); 
            string eventID = log.Entries[e1].EventID.ToString();
            string logMachine = log.Entries[e1].MachineName;
            
            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID +  "\nMachine: " + logMachine;

            Library.WriteErrorLog("Security Event Log{\n" + compiledErrorLog + "}");
        }

        private static void onSystemEntryWritten(object source, EntryWrittenEventArgs e)
        {
            string watchLog = "System";
            string logName = watchLog;
            int e1 = 0;
            EventLog log = new EventLog(logName);
            e1 = log.Entries.Count - 1; // last entry

            string logType = Convert.ToString(log.Entries[e1].EntryType);
            string logCategory = Convert.ToString(log.Entries[e1].Category);
            string eventID = log.Entries[e1].EventID.ToString();
            string logMachine = log.Entries[e1].MachineName;

            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID + "\nMachine: " + logMachine;

            Library.WriteErrorLog("System Event Log{\n" + compiledErrorLog + "}");
        }

        public void trackFileSystemChanges()
        {
            watcher = new FileSystemWatcher();

            // Detects and reports changes in System32 folder
            watcher.IncludeSubdirectories = true;
            watcher.Path = @"C:\Windows\Sysnative";
            watcher.IncludeSubdirectories = true;

            // Watch for changes in LastAccess and LastWrite times, and the renaming of files or directories.
            watcher.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.DirectoryName;
            // Watches all files
            watcher.Filter = "*.*";

            // Add event handlers.
            watcher.Changed += new FileSystemEventHandler(OnChanged);
            watcher.Created += new FileSystemEventHandler(OnChanged);
            watcher.Deleted += new FileSystemEventHandler(OnChanged);
            watcher.Renamed += new RenamedEventHandler(OnRenamed);
        }

        private static void OnChanged(object source, FileSystemEventArgs e)
        {
            // Specify what is done when a file is changed, created, or deleted.
            Library.WriteErrorLog("File: " + e.FullPath + " " + e.ChangeType);
        }

        private static void OnRenamed(object source, RenamedEventArgs e)
        {
            // Specify what is done when a file is renamed.
            Library.WriteErrorLog("File: " + e.OldFullPath + " renamed to " + e.FullPath);
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

        // 31.5.18
        // Evolved getCpuUsage() to get the CPU usage of every single process 
        // However, many processes share the same name, svchost
        // Next step is to find out if it is possible to get the more specific name of svchost processes

        // 20.6.18
        // Added PID to processes to properly identify them, especially svchost
        // I couldn't find a way to attach their full process names so this is a workaround
        // Also added {} for ease of data extraction for chester

        // 21.6.18
        // Found and managed to implement printing of all event logs
        // However, the output was just too huge with a lot of redundant-looking information
        // I'll need to clarify and ask Mr Evans what important data is needed from event logs
        // I've found a class to use for detecting changes in the file system, and that's what I'll work on next

        // 22.6.18
        // Added function to detect the type of changes of files in the System32 directory (Created, changed, deleted, renamed)

        // 28.6.18
        // Edited getEventLogs() function to only send Security & System event viewer logs as they come
        // I also only extracted the important information from the logs so they don't look messy (type, category, eventID, machine name)

    }
}
