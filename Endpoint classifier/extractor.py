import firebase_admin
from firebase_admin import credentials, firestore
import google
import socket
import sys
from _thread import *
from anom_detect import getCpuRisk, getChromeRisk, getRiskValue

# Firebase Initialization
cred = credentials.Certificate('./ServiceAccountKey.json')
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

# Set host and port for socket
HOST = ''
PORT = 8888

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print('Socket created')

# Bind socket to local host and port
try:
    s.bind((HOST, PORT))
except socket.error as msg:
    print('Bind failed. Error Code : ' + str(msg[0]) + ' Message ' + msg[1])
    sys.exit()

print('Socket bind complete')

# Start listening on socket
s.listen(10)
print('Socket now listening')


# Function for handling connections. This will be used to create threads
def clientthread(conn):
    # Sending message to connected client

    # infinite loop so that function do not terminate and thread do not end.
    while True:

        cpuAverages = ""
        chromeAverages = ""

        chromeArray = []

        eventType = ""
        description = ""

        # Receiving from client
        logs = (conn.recv(9999)).decode('utf-8')
        print(logs)
        firstLine = logs.split('\n', 1)[0]


        if "CPU" in firstLine:
            check = False
            doc_ref = db.collection('CPU Logs')
            docs = doc_ref.get()
            time = logs.split(" ", 3)[2]
            for doc in docs:
                values = doc.to_dict()
                if time == values['time']:
                    check = True

            if not check:
                todo = False
                organizationId = "testing"
                chromeCounter = 0
                hostname = logs.split(" ", 2)[0]
                date = logs.split(" ", 2)[1]
                time = logs.split(" ", 3)[2]

                for line in logs.split('\n'):
                    # Converts the logs to only show CPU values in cpuAverages
                    if "Total used" in line:
                        data = line[line.find(": ") + 1:line.find("}")]
                        cpuAverages = ''
                        cpuAverages += data.strip()
                        todo = True
                    # Converts the logs to only show chrome values in chromeAverages
                    elif "chrome" in line:
                        chromeCounter += 1
                        data = line[line.find(": ") + 1:line.find(";")]
                        chromeAverages += data.strip() + "\n"

                if todo:
                    # Calculate total chrome usage
                    for line in chromeAverages.split('\n'):
                        if line.strip():
                            chromeArray.append((float(line)))

                    chromeTotal = len(chromeArray)
                    chromeUsage = sum(chromeArray)

                    doc_ref = db.collection('CPU Logs')
                    query_ref = doc_ref.where(u'hostname', u'==', hostname).where(u'testData', u'==', True)

                    docs = query_ref.get()

                    size = 0
                    for doc in docs:
                        size += 10

                    doc_ref = db.collection('CPU Logs').document()

                    # If there are no documents, set data before processing with a filler risk value
                    if size == 0:
                        doc_ref.set({
                            u'id': 10,
                            u'usage': float(cpuAverages),
                            u'chrome': chromeUsage,
                            u'hostname': hostname,
                            u'organizationId': organizationId,
                            u'date': date,
                            u'time': time,
                            u'testData': True,
                            u'cpuRisk': 'training',
                            u'chromeRisk': 'training'
                        })

                    # If chrome appears in cpu logs
                    if not (chromeTotal == 0):

                        # If its less than 10 entries, all entries are considered test data.
                        # No risk values should be assigned to them
                        if size < 100:
                            doc_ref.set({
                                u'id': size + 10,
                                u'usage': float(cpuAverages),
                                u'chrome': chromeUsage,
                                u'hostname': hostname,
                                u'organizationId': organizationId,
                                u'date': date,
                                u'time': time,
                                u'testData': True,
                                u'cpuRisk': 'training',
                                u'chromeRisk': 'training'
                            })

                        elif size >= 100:
                            tempSize = 0
                            tempSize = size + 10
                            # First, set values with testData as true
                            # so that it will be included in the baseline
                            doc_ref.set({
                                u'id': tempSize,
                                u'usage': float(cpuAverages),
                                u'chrome': chromeUsage,
                                u'hostname': hostname,
                                u'organizationId': organizationId,
                                u'date': date,
                                u'time': time,
                                u'testData': True,
                                u'cpuRisk': '',
                                u'chromeRisk': ''
                            })

                            # If risk is high, don't add to baseline
                            # This is to prevent the baseline from being ruined by anomalous values
                            cpuRisk = getCpuRisk(tempSize)
                            chromeRisk = getChromeRisk(tempSize)
                            doc_ref = db.collection('CPU Logs')
                            # Set query reference to get the document ID
                            query_ref = doc_ref.where(u'id', u'==', tempSize)
                            docs = query_ref.get()
                            for doc in docs:
                                documentId = doc.id

                            # Set new document reference
                            doc_ref = db.collection('CPU Logs').document(documentId)

                            # If the risk value is high, don't include it in baseline and set new risk value
                            if cpuRisk == 'high':
                                doc_ref.update({
                                    u'id': 0,
                                    u'testData': False,
                                    u'cpuRisk': cpuRisk
                                })

                            elif not cpuRisk == 'high':
                                doc_ref.update({
                                    u'id': tempSize,
                                    u'testData': True,
                                    u'cpuRisk': cpuRisk
                                })

                            if chromeRisk == 'high':
                                doc_ref.update({
                                    u'id': 0,
                                    u'testData': False,
                                    u'chromeRisk': chromeRisk
                                })

                            elif not chromeRisk == 'high':
                                doc_ref.update({
                                    u'id': tempSize,
                                    u'testData': True,
                                    u'chromeRisk': chromeRisk
                                })


                    # If there were no chrome logs
                    elif chromeTotal == 0:

                        # If its less than 10 entries, all entries are considered test data.
                        # No risk values should be assigned to them
                        # Set chrome as 0
                        if size < 100:
                            doc_ref.set({
                                u'id': size + 10,
                                u'usage': float(cpuAverages),
                                u'chrome': 0,
                                u'hostname': hostname,
                                u'organizationId': organizationId,
                                u'date': date,
                                u'time': time,
                                u'testData': True,
                                u'cpuRisk': 'training',
                                u'chromeRisk': 'training'
                            })

                        elif size >= 100:
                            tempSize = 0
                            tempSize = size + 10
                            # First, set values with testData as true
                            # so that it will be included in the baseline
                            # Set chrome as 0
                            doc_ref.set({
                                u'id': tempSize,
                                u'usage': float(cpuAverages),
                                u'chrome': 0,
                                u'hostname': hostname,
                                u'organizationId': organizationId,
                                u'date': date,
                                u'time': time,
                                u'testData': True,
                                u'cpuRisk': '',
                                u'chromeRisk': ''
                            })

                            # If risk is high, don't add to baseline
                            # This is to prevent the baseline from being ruined by anomalous values
                            cpuRisk = getCpuRisk(tempSize)
                            chromeRisk = getChromeRisk(tempSize)

                            doc_ref = db.collection('CPU Logs')
                            # Set query reference to get the document ID
                            query_ref = doc_ref.where(u'id', u'==', tempSize)
                            docs = query_ref.get()
                            for doc in docs:
                                documentId = doc.id

                            # Set new document reference
                            doc_ref = db.collection('CPU Logs').document(documentId)

                            # If the risk value is high, don't include it in baseline and set new risk value
                            if cpuRisk == 'high':
                                doc_ref.update({
                                    u'id': 0,
                                    u'testData': False,
                                    u'cpuRisk': cpuRisk
                                })

                            elif not cpuRisk == 'high':
                                doc_ref.update({
                                    u'id': tempSize,
                                    u'testData': True,
                                    u'cpuRisk': cpuRisk
                                })

                            if chromeRisk == 'high':
                                doc_ref.update({
                                    u'id': 0,
                                    u'testData': False,
                                    u'chromeRisk': chromeRisk
                                })

                            elif not chromeRisk == 'high':
                                doc_ref.update({
                                    u'id': tempSize,
                                    u'testData': True,
                                    u'chromeRisk': chromeRisk
                                })

                    # Firebase document reference
                    doc_ref = db.collection('Endpoint-Client').document(hostname)

                    doc = doc_ref.get()
                    values = doc.to_dict()

                    cloudCpuAverage = values['cpuAverage']
                    cloudChromeTotal = values['chromeTotal']
                    cloudChromeUsage = values['chromeUsage']
                    cpuCount = values['cpuCount']

                    chromeCounter += cloudChromeTotal
                    chromeUsage += cloudChromeUsage
                    cpuCount += 1

                    chromeAverage = 0

                    # If chrome was in the logs
                    # Calculate chrome average
                    if not (chromeTotal == 0):
                        chromeAverage = chromeUsage / chromeCounter

                    # If there was cpu before
                    # Calculate new average
                    if not (cloudCpuAverage == 0):
                        floatAverage = float(cpuAverages)
                        floatAverage += cloudCpuAverage
                        finalFloat = floatAverage/cpuCount
                        doc_ref.update({
                            u'cpuCount': cpuCount,
                            u'cpuAverage': finalFloat,
                            u'chromeAverage': chromeAverage,
                            u'chromeTotal': chromeCounter,
                            u'chromeUsage': chromeUsage
                        })

                    # Otherwise, it's the first CPU entry
                    # Set cpu average
                    else:
                        doc_ref.update({
                            u'cpuCount': 1,
                            u'cpuAverage': float(cpuAverages),
                            u'chromeAverage': chromeAverage,
                            u'chromeTotal': chromeCounter,
                            u'chromeUsage': chromeUsage
                        })

        elif "Event" in firstLine:
            check = False
            doc_ref = db.collection('CPU Logs')
            docs = doc_ref.get()
            hostname = logs.split(" ", 1)[0]
            time = logs.split(" ", 3)[2]
            for doc in docs:
                values = doc.to_dict()
                if time == values['time']:
                    check = True

            if not check:
                doc_ref = db.collection('Endpoint-Client').document(hostname)

                # Check what type of log it is
                if "Application Event Log" in firstLine:
                    eventType = "Application"
                elif "System Event Log" in firstLine:
                    eventType = "System"
                elif "Security Event Log" in firstLine:
                    eventType = "Security"

                # Extract the description of the event log
                for line in logs.split('\n'):
                    if "<" in line:
                        description = line.split('<', 1)[1]

                # Check if document exists
                try:
                    doc_ref.get()
                    exists = True
                except google.cloud.exceptions.NotFound:
                    exists = False

                if exists:
                    doc = doc_ref.get()
                    values = doc.to_dict()
                    toCheck = values['ev1']
                    toCheck2 = values['ev2']

                    # If there are no events, append this event as the first event
                    if toCheck == "":
                        doc_ref.update({
                            u'ev1': eventType,
                            u'desc1': description
                        })

                    # If there is only 1 event, move that to be the second event and assign this event as first
                    if not toCheck == "" and toCheck2 == "":
                        ev1 = values['ev1']
                        desc1 = values['desc1']

                        doc_ref.update({
                            u'ev1': eventType,
                            u'ev2': ev1,
                            u'desc1': description,
                            u'desc2': desc1,
                        })

                    # If there are at least 2 events, first becomes second,
                    # second becomes third, this event becomes new first
                    elif not toCheck2 == "":
                        ev1 = values['ev1']
                        ev2 = values['ev2']
                        desc1 = values['desc1']
                        desc2 = values['desc2']
                        doc_ref.update({
                            u'ev1': eventType,
                            u'ev2': ev1,
                            u'ev3': ev2,
                            u'desc1': description,
                            u'desc2': desc1,
                            u'desc3': desc2
                        })

                # Set first event if document does not exist
                elif not exists:
                    doc_ref.set({
                        u'cpuCount': 0,
                        u'cpuAverage': 0,
                        u'chromeAverage': 0,
                        u'chromeTotal': 0,
                        u'chromeUsage': 0,
                        u'ev1': eventType,
                        u'desc1': description,
                        u'ev2': "",
                        u'desc2': "",
                        u'ev3': "",
                        u'desc3': "",
                        u'orgId': 'testing'
                    })


# now keep talking with the client
while 1:
    # wait to accept a connection - blocking call
    conn, addr = s.accept()
    print('Connected with ' + addr[0] + ':' + str(addr[1]))

    # start new thread takes 1st argument as a function name to be run
    # second is the tuple of arguments to the function.
    start_new_thread(clientthread, (conn,))
