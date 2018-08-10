import socket
from threading import *
import datetime

serversocket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host2 = "10.8.0.1"
port2 = 50998

port = 49888

serversocket.bind(('',port))
s.connect((host2,port2))

class client(Thread):
    def __init__(self, socket, address):
        Thread.__init__(self)
        self.sock = socket
        self.addr = address
        self.start()
        print("Started connection")
    def run(self):
        
        while 1:
            text = self.sock.recv(999999).decode('utf-8')
        
            s.sendall(text)
            print(text)
            print("---This is the end----")
            #self.sock.send(b'Oi you sent something to me')

serversocket.listen(5)

while True:
 
   # Establish connection with client.
   print("running socket")
   clientsocket, address = serversocket.accept()
   client(clientsocket, address)
