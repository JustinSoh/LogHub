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

        /*static Socket soc123 = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        static System.Net.IPAddress ipAdd = System.Net.IPAddress.Parse("192.168.1.139");
        static System.Net.IPEndPoint remoteEP = new System.Net.IPEndPoint(ipAdd, 49153);

        public static void startConection()
        {
            soc123.Connect(remoteEP);
        }

        public static void closeConnection()
        {
            soc123.Close();
        }*/

        public static void WriteErrorLog(Exception ex)
        {
            StreamWriter sw = null;

            try
            {
                //byte[] byData = System.Text.Encoding.ASCII.GetBytes(DateTime.Now.ToString() + ": " + ex.Source.ToString().Trim() + "; " + ex.Message.ToString().Trim());
                //soc123.Send(byData);
                sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\" + date + "-" + time + "-" + System.Environment.MachineName + ".txt", true);
                sw.WriteLine(System.Environment.MachineName + " " + DateTime.Now.ToString() + ": " + ex.Source.ToString().Trim() + "; " + ex.Message.ToString().Trim());
                sw.Flush();
                sw.Close();
            }
            catch { }
        }

        public static void WriteErrorLog(string Message)
        {
            StreamWriter sw = null;
            string hostname = Service1.getHostname();

            try
            {
                //byte[] byData = System.Text.Encoding.ASCII.GetBytes(DateTime.Now.ToString() + ": " + Message);
                //soc123.Send(byData);
                sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\" + date + "-" + time + "-" + System.Environment.MachineName + ".txt", true);
                sw.WriteLine(System.Environment.MachineName + " " + DateTime.Now.ToString() + ": " + Message);
                sw.Flush();
                sw.Close();
            }
            catch { }
        }
    }
}
