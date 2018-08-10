import subprocess
import sys
import socket
import datetime
import random

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host = "10.8.0.1"
port = 60022
proc = subprocess.Popen(["vnstat", "-l", "-i", "eth0"], stdout=subprocess.PIPE) #receieving
proc2 = subprocess.Popen(["vnstat", "-l", "-i", "wlan1"], stdout=subprocess.PIPE) #Transmitting
s.connect((host,port))
organisationId = 'testing'
randomBandwidthId = 0

while True:  # a STDOUT read loop
    randomBandwidthId = randomBandwidthId + 1
    output = proc.stdout.read(158)  # grab one character from vnstat's STDOUT
    output2 = proc2.stdout.read(158)
    if output == "" and proc.poll() is not None:  # process finished, exit the loop
        break
    #sys.stdout.write(output)  # write the output to Python's own STDOUT
    
    
    sys.stdout.flush()  # flush it...
    totalArray = []
    totalArray2 = []
    num = 0
    if "rx:" in output:
        data = output.split(" ")
        for output in data:
            if output is not " " and output is not "":
                data = output.split("\n")
                totalArray.append(data)
            
    if "rx:" in output2:
        data2 = output2.split(" ")
        for output2 in data2:
            if output2 is not " " and output2 is not "":
                data2 = output2.split("\n")
                totalArray2.append(data2)


    rx = str(totalArray[2][0]) + " " + str(totalArray[3][0])
    tx = str(totalArray2[7][0]) + " " + str(totalArray2[8][0])
    print(rx)
    print(tx)
    #print(output)
    totalString = str(randomBandwidthId )+ "," + "PiCollecter1" + "," + organisationId + "," + ' {:%H:%M:%S %d/%m/%Y}'.format(datetime.datetime.now()) + "," + str(rx) + "," + str(tx)
    s.send(totalString)
    print(totalString)
    # of course, you can collect the output instead of printing it to the screen...
print("\nProcess finished.")