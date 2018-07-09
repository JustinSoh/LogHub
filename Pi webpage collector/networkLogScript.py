import pyshark
out_string = ""
i = 1

cap = pyshark.LiveCapture(interface='wlan0')

cap.sniff(timeout=50)

for pkt in cap:

    out_file = open("Logs/logs.txt", "w")
    out_string += "Packet #         " + str(i)
    out_string += "\n"
    out_string += str(pkt)
    out_string += "\n"
    out_file.write(out_string)
    i = i + 1

