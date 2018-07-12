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
        //Initilization of variables
        private System.Timers.Timer thirtySecondTimer = null;
        private System.Timers.Timer oneSecondTimer = null;
        FileSystemWatcher watcher;
        private static PerformanceCounter diskRead = new PerformanceCounter();
        private static PerformanceCounter diskWrite = new PerformanceCounter();
        static double readCounter = 0;
        static double writeCounter = 0;
        static double totalCPU;
        static double CpuCounter;

        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            // Disk Read stuff
            diskRead.CategoryName = "PhysicalDisk";
            diskRead.CounterName = "Disk Reads/sec";
            diskRead.InstanceName = "_Total";

            // Disk Write stuff
            diskWrite.CategoryName = "PhysicalDisk";
            diskWrite.CounterName = "Disk Writes/sec";
            diskWrite.InstanceName = "_Total";

            // Logs that do not come every 30 seconds
            trackFileSystemChanges();
            watcher.EnableRaisingEvents = true;
            getEventLogs();

            // Logs that come every 30 seconds
            thirtySecondTimer = new System.Timers.Timer();
            this.thirtySecondTimer.Interval = 30000; //Runs every 30 seconds
            this.thirtySecondTimer.Elapsed += new System.Timers.ElapsedEventHandler(this.thirtySecondTimer_tick);
            thirtySecondTimer.Enabled = true;
            Library.WriteErrorLog("LogHub has started.");

        }

        protected override void OnStop()
        {
            Library.WriteErrorLog("LogHub has stopped.");
        }

        private void thirtySecondTimer_tick(object sender, ElapsedEventArgs e)
        {
            // Prints Battery & CPU usage data
            Library.WriteErrorLog("Battery{" + getBatteryPercentage() + "}");
            Library.WriteErrorLog(getCpuUsage());

            // Returns the total number of disk reads + writes every 30 seconds
            oneSecondTimer = new System.Timers.Timer();
            this.oneSecondTimer.Interval = 1000; //Runs every second
            this.oneSecondTimer.Elapsed += new System.Timers.ElapsedEventHandler(this.oneSecondTimer_tick);
            oneSecondTimer.Enabled = true;
            Library.WriteErrorLog("Total Disk Reads{" + readCounter + "KB}");
            Library.WriteErrorLog("Total Disk Writes{" + writeCounter + "KB}");

            // Restarts read/write counters
            readCounter = 0;
            writeCounter = 0;
        }

        private void oneSecondTimer_tick(object sender, ElapsedEventArgs e)
        {
            readCounter += Convert.ToDouble(diskRead.NextValue());
            writeCounter += Convert.ToDouble(diskWrite.NextValue());
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
                CpuCounter = Math.Round(counter.NextValue(), 1);
                stringsOfCpu += (processes[i].ProcessName + "(" + +processes[i].Id +"): " + CpuCounter / processorCount) + ";\n";
                if (processes[i].ProcessName.Equals("Idle"))
                {
                    totalCPU = 100 - (CpuCounter/processorCount);
                }
                ++i;   
            }

            return "CPU{" + stringsOfCpu+ "Total used: " + totalCPU +"}";
        }

        static void getEventLogs()
        {
            EventLog mySecurityLog = new EventLog("Security");
            mySecurityLog.EntryWritten += new EntryWrittenEventHandler(onSecurityEntryWritten);
            mySecurityLog.EnableRaisingEvents = true;

            EventLog mySystemLog = new EventLog("System");
            mySystemLog.EntryWritten += new EntryWrittenEventHandler(onSystemEntryWritten);
            mySystemLog.EnableRaisingEvents = true;

            EventLog myApplicationLog = new EventLog("Application");
            myApplicationLog.EntryWritten += new EntryWrittenEventHandler(onApplicationEntryWritten);
            myApplicationLog.EnableRaisingEvents = true;
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
            string logDescription = log.Entries[e1].Message;

            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID +  "\nMachine: " + logMachine + "\nDescription:<" +logDescription+">";

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
            string logDescription = log.Entries[e1].Message;

            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID + "\nMachine: " + logMachine + "\nDescription:<" + logDescription + ">";

            Library.WriteErrorLog("System Event Log{\n" + compiledErrorLog + "}");
        }

        private static void onApplicationEntryWritten(object source, EntryWrittenEventArgs e)
        {
            string watchLog = "Application";
            string logName = watchLog;
            int e1 = 0;
            EventLog log = new EventLog(logName);
            e1 = log.Entries.Count - 1; // last entry

            string logType = Convert.ToString(log.Entries[e1].EntryType);
            string logCategory = Convert.ToString(log.Entries[e1].Category);
            string eventID = log.Entries[e1].EventID.ToString();
            string logMachine = log.Entries[e1].MachineName;
            string logDescription = log.Entries[e1].Message;

            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID + "\nMachine: " + logMachine + "\nDescription:<" + logDescription + ">";

            Library.WriteErrorLog("Application Event Log{\n" + compiledErrorLog + "}");
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
            Library.WriteErrorLog("File:{" + e.FullPath + " " + e.ChangeType + "}");
        }

        private static void OnRenamed(object source, RenamedEventArgs e)
        {
            // Specify what is done when a file is renamed.
            Library.WriteErrorLog("File:{" + e.OldFullPath + " renamed to " + e.FullPath +"}");
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
        // Also added {} for ease of data extraction for Chester

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

        // 1.7.18
        // Added a function to extract number of reads and writes to all disks

        // 10.7.18
        // Appended Event Viewer descriptions and added Application Event Logs as per Chester's request.

        // 12.7.18
        // Added total CPU used per given duration as per Justin's request.
        // Also added the once forgotten {} delimiters on the file changed methods

    }
}
