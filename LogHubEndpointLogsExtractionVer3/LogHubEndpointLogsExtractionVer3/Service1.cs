using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Security.Permissions;
using System.ServiceProcess;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using System.Windows.Forms;

namespace LogHubEndpointLogsExtractionVer3
{
    public partial class Service1 : ServiceBase
    {
        //Initilization of variables
        private System.Timers.Timer twentySecondTimer = null;
        private System.Timers.Timer oneSecondTimer = null;
        private System.Timers.Timer networkOneSecondTimer = null;
        FileSystemWatcher watcherSys32;
        //FileSystemWatcher watcherAppData;
        //FileSystemWatcher watcherProgramData;
        string username = Environment.UserName;
        private static PerformanceCounter diskRead = new PerformanceCounter();
        private static PerformanceCounter diskWrite = new PerformanceCounter();
        static double readCounter = 0;
        static double writeCounter = 0;
        static double totalCPU;
        static double CpuCounter;
        NetworkInterface[] adapters = NetworkInterface.GetAllNetworkInterfaces();
        long receivedBeginValue = 0;
        long sentBeginValue = 0;
        long receivedEndValue = 0;
        long sentEndValue = 0;
        DateTime beginTime;
        DateTime endTime;
        long receivedBytes = 0;
        long sentBytes = 0;
        string bytesReceivedString;
        string bytesSentString;
        static string firstMacAddress;

        public Service1()
        {
            InitializeComponent();
            Library.startConection();
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
            watcherSys32.EnableRaisingEvents = true;
            //watcherAppData.EnableRaisingEvents = true;
            //watcherProgramData.EnableRaisingEvents = true;
            getEventLogs();
            checkUsbInsert();
            checkUsbRemove();

            // Logs that come every 30 seconds
            twentySecondTimer = new System.Timers.Timer();
            //this.twentySecondTimer.Interval = 30000; //Runs every 30 seconds
            this.twentySecondTimer.Interval = 20000; //Runs every 20 seconds
            this.twentySecondTimer.Elapsed += new System.Timers.ElapsedEventHandler(this.twentySecondTimer_tick);
            twentySecondTimer.Enabled = true;
            Library.WriteErrorLog("LogHub has started.");

            // Network Data log
            networkOneSecondTimer = new System.Timers.Timer();
            this.networkOneSecondTimer.Interval = 1000; //Runs every half a second
            this.networkOneSecondTimer.Elapsed += new System.Timers.ElapsedEventHandler(this.networkOneSecondTimer_tick);
            networkOneSecondTimer.Enabled = true;

            // Get hostname, IP address, MAC address, & Deafult Gateway
            sendOrganizationId();
            Library.WriteErrorLog("@Hostname@{" + getHostname() + "}");
            Library.WriteErrorLog("@IP Address@{" + getIpAddress() + "}");
            getMacAddress();
            getDefaultGateway();

            // Sends Justin logs
            Library.WriteBandwidthLog("@check@:" + getHostname() + "," + sendOrganizationId() + "," + getIpAddress() + "," + getDefaultGateway() + "," + getMacAddress() + "\n");
        }

        protected override void OnStop()
        {
            Library.WriteErrorLog("LogHub has stopped.");
        }

        private void twentySecondTimer_tick(object sender, ElapsedEventArgs e)
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

            // Gets Established Connections
            Library.WriteErrorLog("Established Connections{\n" + getEstablishedConnections() + "}");

            // Sends Justin Logs
            //Library.WriteBandwidthLog("@check@:" + getHostname() + "," + sendOrganizationId() + "," + getIpAddress() + "," + getDefaultGateway() + "," + getMacAddress() + "\n");

        }

        private void oneSecondTimer_tick(object sender, ElapsedEventArgs e)
        {
            // Disk Read/Write
            readCounter += Convert.ToDouble(diskRead.NextValue());
            writeCounter += Convert.ToDouble(diskWrite.NextValue());
        }

        private void networkOneSecondTimer_tick(object sender, ElapsedEventArgs e)
        {
            foreach (NetworkInterface nic in adapters)
            {
                //Hardcoded to network interface called Wi-Fi
                if ((nic.Name).Equals("Wi-Fi"))
                {
                    IPv4InterfaceStatistics interfaces = nic.GetIPv4Statistics();

                    receivedBeginValue = nic.GetIPv4Statistics().BytesReceived;
                    sentBeginValue = nic.GetIPv4Statistics().BytesSent;
                    beginTime = DateTime.Now;

                    Thread.Sleep(1000);

                    receivedEndValue = nic.GetIPv4Statistics().BytesReceived;
                    sentEndValue = nic.GetIPv4Statistics().BytesSent;
                    endTime = DateTime.Now;

                    receivedBytes = receivedEndValue - receivedBeginValue;
                    sentBytes = sentEndValue - sentBeginValue;

                    bytesReceivedString = receivedBytes.ToString();
                    bytesSentString = sentBytes.ToString();

                    Library.WriteBandwidthLog("Download/Upload{" + bytesReceivedString + "B/s," + bytesSentString + "B/s}");
                }
            }
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
                stringsOfCpu += (processes[i].ProcessName + "(" + +processes[i].Id + "): " + CpuCounter / processorCount) + ";\n";
                if (processes[i].ProcessName.Equals("Idle"))
                {
                    totalCPU = 100 - (CpuCounter / processorCount);
                }
                ++i;
            }

            return "CPU{\n" + stringsOfCpu + "Total used: " + totalCPU + "}\n";
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

            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID + "\nMachine: " + logMachine + "\nDescription:<" + logDescription;

            Library.WriteErrorLog("Security Event Log{\n" + compiledErrorLog);
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

            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID + "\nMachine: " + logMachine + "\nDescription:<" + logDescription;

            Library.WriteErrorLog("System Event Log{\n" + compiledErrorLog);
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

            string compiledErrorLog = "Log Type: " + logType + "\nCategory: " + logCategory + "\nEvent ID: " + eventID + "\nMachine: " + logMachine + "\nDescription:<" + logDescription;

            Library.WriteErrorLog("Application Event Log{\n" + compiledErrorLog);
        }

        public void trackFileSystemChanges()
        {
            watcherSys32 = new FileSystemWatcher();
            //watcherAppData = new FileSystemWatcher();
            //watcherProgramData = new FileSystemWatcher();

            //======================================================

            // Detects and reports changes in System32 folder
            watcherSys32.IncludeSubdirectories = true;
            watcherSys32.Path = @"C:\Windows\Sysnative";
            watcherSys32.IncludeSubdirectories = true;

            // Detects and reports changes in AppData Folder
            //watcherAppData.IncludeSubdirectories = true;
            //watcherAppData.Path = @"C:\Users\" + username + @"\AppData";
            //watcherAppData.IncludeSubdirectories = true;

            // Detects and reports changes in ProgramData folder
            //watcherProgramData.IncludeSubdirectories = true;
            //watcherProgramData.Path = @"C:\ProgramData";
            //watcherProgramData.IncludeSubdirectories = true;

            //======================================================

            // Watch for changes in LastAccess and LastWrite times, and the renaming of files or directories.
            watcherSys32.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.DirectoryName;
            //watcherAppData.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.DirectoryName;
            //watcherProgramData.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.DirectoryName;

            // Watches all files
            watcherSys32.Filter = "*.*";
            //watcherAppData.Filter = "*.*";
            //watcherProgramData.Filter = "*.*";

            // Add event handlers.
            watcherSys32.Changed += new FileSystemEventHandler(OnChanged);
            watcherSys32.Created += new FileSystemEventHandler(OnChanged);
            watcherSys32.Deleted += new FileSystemEventHandler(OnChanged);
            watcherSys32.Renamed += new RenamedEventHandler(OnRenamed);

            //watcherAppData.Changed += new FileSystemEventHandler(OnChanged);
            //watcherAppData.Created += new FileSystemEventHandler(OnChanged);
            //watcherAppData.Deleted += new FileSystemEventHandler(OnChanged);
            //watcherAppData.Renamed += new RenamedEventHandler(OnRenamed);

            //watcherProgramData.Changed += new FileSystemEventHandler(OnChanged);
            //watcherProgramData.Created += new FileSystemEventHandler(OnChanged);
            //watcherProgramData.Deleted += new FileSystemEventHandler(OnChanged);
            //watcherProgramData.Renamed += new RenamedEventHandler(OnRenamed);
        }

        private static void OnChanged(object source, FileSystemEventArgs e)
        {
            // Specify what is done when a file is changed, created, or deleted.
            Library.WriteErrorLog("File:{" + e.FullPath + " " + e.ChangeType + "}");
        }

        private static void OnRenamed(object source, RenamedEventArgs e)
        {
            // Specify what is done when a file is renamed.
            Library.WriteErrorLog("File:{" + e.OldFullPath + " renamed to " + e.FullPath + "}");
        }

        private static string getEstablishedConnections()
        {
            string cmd = "/c netstat -an | findstr ESTA";
            System.Diagnostics.Process proc = new System.Diagnostics.Process();
            proc.StartInfo.FileName = "cmd.exe";
            proc.StartInfo.Arguments = cmd;
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.RedirectStandardOutput = true;
            proc.StartInfo.CreateNoWindow = true;
            proc.Start();
            string establishedConnections = proc.StandardOutput.ReadToEnd();
            proc.Close();

            return establishedConnections;
        }

        private static void checkUsbInsert()
        {
            ManagementEventWatcher watcher = new ManagementEventWatcher();
            WqlEventQuery query = new WqlEventQuery("SELECT * FROM Win32_VolumeChangeEvent WHERE EventType = 2");
            watcher.EventArrived += new EventArrivedEventHandler(watcher_InsertArrived);
            watcher.Query = query;
            watcher.Start();
        }

        private static void watcher_InsertArrived(Object sender, EventArrivedEventArgs e)
        {
            Library.WriteErrorLog("USB{Inserted}");
        }

        private static void checkUsbRemove()
        {
            ManagementEventWatcher watcher = new ManagementEventWatcher();
            WqlEventQuery query = new WqlEventQuery("SELECT * FROM Win32_VolumeChangeEvent WHERE EventType = 3");
            watcher.EventArrived += new EventArrivedEventHandler(watcher_RemoveArrived);
            watcher.Query = query;
            watcher.Start();
        }

        private static void watcher_RemoveArrived(Object sender, EventArrivedEventArgs e)
        {
            Library.WriteErrorLog("USB{Removed}");
        }

       public static string getHostname()
        {
            Library.WriteBandwidthLog("@Hostname@{" + System.Environment.MachineName + "}");
            return System.Environment.MachineName;
        }

        public static string getIpAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            return "APIPA";
        }

        static string getMacAddress()
        {
            firstMacAddress = NetworkInterface
                .GetAllNetworkInterfaces()
                .Where(nic => nic.OperationalStatus == OperationalStatus.Up && nic.NetworkInterfaceType != NetworkInterfaceType.Loopback)
                .Select(nic => nic.GetPhysicalAddress().ToString())
                .FirstOrDefault();

            return firstMacAddress;
        }

        static string getDefaultGateway()
        {
            string cmdGateway = "\"Gateway\"";
            string cmd = "/c ipconfig | findstr /i " + cmdGateway;

            System.Diagnostics.Process proc = new System.Diagnostics.Process();
            proc.StartInfo.FileName = "cmd.exe";
            proc.StartInfo.Arguments = cmd;
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.RedirectStandardOutput = true;
            proc.StartInfo.CreateNoWindow = true;
            proc.Start();
            cmdGateway = proc.StandardOutput.ReadToEnd();
            proc.Close();

            Regex ip = new Regex(@"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b");
            MatchCollection gateway = ip.Matches(cmdGateway);

            Library.WriteErrorLog("@Default Gateway@{" + gateway[0] + "}");
            return gateway[0].ToString();
        }

        static string sendOrganizationId()
        {
            string organizationId = "testing";
            Library.WriteErrorLog("@Organization ID@{" + organizationId + "}");
            return organizationId;
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

        // 15.7.18
        // Altered 30 second timer to send logs every 5 seconds.
        // I will monitor the effects of this change and may revert or decrease the timer duration.

        // 19.7.18
        // Added function to get established connections from host with port number, to external IPs
        // Added function to detect insertion/removal of external devices

        // 23.7.18
        // Added function to send hostname and ip address of workstation.
        // They will be sent every time Loghub starts.

        // 27.7.18
        // Added function to send download/upload speed in Bytes per Second, every one second.
        // Also, I commented out Bryan's code that sends data to his raspberry pi so that I can effectively test my code.
        // Remember to uncomment his code in Library.cs and in Service1() method of this Class.

        // 27.7.18
        // Renamed thirtySecondTimer to twentySecondTimer.
        // Added function to send MAC address and Default Gateway.
    }
}