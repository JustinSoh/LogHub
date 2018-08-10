import dpkt, pcap
out_string = ""
i = 1

pc = pcap.pcap()     # construct pcap object
pc.setfilter('icmp') # filter out unwanted packets
for timestamp, packet in pc:
    print dpkt.ethernet.Ethernet(packet)
    out_file = open("Logs/logs.txt", "w")
    out_string += "Packet #         " + str(i)
    out_string += "\n"
    out_string += dpkt.ethernet.Ethernet(packet)
    out_string += "\n"
    out_file.write(out_string)
    i = i + 1
