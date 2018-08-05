using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net.Sockets;

namespace LogHubEndpointLogsExtractionVer3
{
    class Library
    {
        static string date = DateTime.Now.ToString("ddMMyyyy");
        static string time = DateTime.Now.ToString("hhmmss");

        static Socket soc123 = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        static Socket soc456 = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

        static System.Net.IPAddress ipAddChester = System.Net.IPAddress.Parse("192.168.1.146");
        static System.Net.IPEndPoint remoteEP = new System.Net.IPEndPoint(ipAddChester, 8888);

        static System.Net.IPAddress ipAddJustin = System.Net.IPAddress.Parse("192.168.1.140");
        static System.Net.IPEndPoint remoteEP2 = new System.Net.IPEndPoint(ipAddJustin, 60222);

        static string organizationId = "testing";

        public static void startConection()
        {
            soc123.Connect(remoteEP);
            soc456.Connect(remoteEP2);                      
        }

        public static void closeConnection()
        {
            soc123.Close();
            soc456.Close();
        }

        public static void WriteBandwidthLog(string Message)
        {
            StreamWriter sw = null;

            try
            {
                byte[] byData = System.Text.Encoding.ASCII.GetBytes(System.Environment.MachineName + " " + DateTime.Now.ToString() + " " + organizationId + ": " + Message);
                soc456.SendBufferSize = 99999;
                soc456.Send(byData);
                sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\" + date + "-" + time + "-" + System.Environment.MachineName + ".txt", true);
                sw.WriteLine(System.Environment.MachineName + " " + DateTime.Now.ToString() + ": " + Message);
                sw.Flush();
                sw.Close();
            }
            catch { }
        }

        public static void WriteErrorLog(Exception ex)
        {
            StreamWriter sw = null;

            try
            {
                soc123.SendBufferSize = 99999;
                byte[] byData = System.Text.Encoding.ASCII.GetBytes(System.Environment.MachineName + " " + DateTime.Now.ToString() + ": " + ex.Source.ToString().Trim() + "; " + ex.Message.ToString().Trim());
                soc123.Send(byData);
                int abc = soc123.Send(byData);
                sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\" + date + "-" + time + "-" + System.Environment.MachineName + ".txt", true);
                sw.WriteLine(System.Environment.MachineName + " " + DateTime.Now.ToString() + ": " + ex.Source.ToString().Trim() + "; " + ex.Message.ToString().Trim() + "\nBuffer" + abc);
                sw.Flush();
                sw.Close();
            }
            catch { }
        }

        public static void WriteErrorLog(string Message)
        {
            StreamWriter sw = null;

            try
            {
                byte[] byData = System.Text.Encoding.ASCII.GetBytes(System.Environment.MachineName + " " + DateTime.Now.ToString() + ": " + Message);
                soc123.SendBufferSize = 99999;
                soc123.Send(byData);
                int abc = soc123.Send(byData);
                sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\" + date + "-" + time + "-" + System.Environment.MachineName + ".txt", true);
                sw.WriteLine(System.Environment.MachineName + " " + DateTime.Now.ToString() + ": " + Message + "\nBuffer:" + abc);
                sw.Flush();
                sw.Close();
            }
            catch { }
        }
    }
}
