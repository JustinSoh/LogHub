class pysharkSniffer():
    import pyshark
    import datetime
    out_string = ""
    i = 1
    print("running")
    cap = pyshark.LiveCapture(interface='br0')
    cap.set_debug()
    cap.sniff()

    for pkt in cap.sniff_continuously():
        print("found packets")
        out_file = open("Logs/logs.txt", "w")
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
