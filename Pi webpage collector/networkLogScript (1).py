class pysharkSniffer():
    import pyshark
    import datetime
    #output_file="/home/pi/Desktop/Project/Logs/logs.pcap"
    from subprocess import call
    out_string = ""
    i = 1
    print("running")
    cap = pyshark.LiveCapture(interface='wlan1',display_filter="http")
    cap.set_debug()
    call('sudo tshark -i wlan1 -w /home/pi/Desktop/Project/Logs/logs.pcap', shell=True)
    cap.sniff(timeout=1)

    for pkt in cap.sniff_continuously():
        print("found packets")
        out_file = open("/home/pi/Desktop/Project/Logs/logs.txt", "w")
        out_string += "Packet #         " + str(i)
        out_string += "\n"
        out_string += 'TimeStamp: {:%H:%M:%S %d/%m/%Y}'.format(datetime.datetime.now())
        out_string += "\n"
        out_string += str(pkt)
        out_string += "\n"
        out_file.write(out_string)
        print(out_string)
        i = i + 1
    cap.close()