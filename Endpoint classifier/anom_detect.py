import numpy as np
from sklearn.neighbors import NearestNeighbors
import firebase_admin
from firebase_admin import credentials, firestore


def getCpuRisk(id):
    print('Getting cpu')
    # Firebase initialization
    cred = credentials.Certificate('./ServiceAccountKey.json')
    if not (firebase_admin.get_app()):
        firebase_admin.initialize_app(cred)
    db = firestore.client()

    # Get document of id
    doc_ref = db.collection('CPU Logs')
    query_ref = doc_ref.where(u'id', u'==', id)
    docs = query_ref.get()

    usage = 0
    for doc in docs:
        values = doc.to_dict()
        usage = values['usage']

    print(usage)
    # Automatically set as high risk if it is above 85.
    if usage > 85:
        return 'high'
    else:
        # Define numpy array with a dummy value.
        X = np.array([[0, 0.0]])
        query_ref = doc_ref.where(u'testData', u'==', True).order_by(u'id', direction=firestore.Query.DESCENDING)
        docs = query_ref.get()

        # Append [id, usage] into the numpy array so that smaller value is at the front.
        for doc in docs:
            values = doc.to_dict()
            id = values['id']
            usage = values['usage']
            X = np.insert(X, 0, np.array((id, usage)), 0)

        # Delete dummy value from numpy array.
        X = np.delete(X, len(X) - 1, 0)

        # Set k = 6, means that it will check for 5 nearest neighbors as
        # itself will be considered the nearest neighbor.
        nbrs = NearestNeighbors(n_neighbors=6, algorithm='ball_tree', metric='euclidean').fit(X)
        distances, indices = nbrs.kneighbors(X)
        print(indices)
        # Set parent as the indices (nearest neighbors) of the id that we are checking.
        parent = indices[len(X)-1]

        # Assign five children
        child1 = parent[1]
        child2 = parent[2]
        child3 = parent[3]
        child4 = parent[4]
        child5 = parent[5]

        # Calculate the 5 nearest neighbors of the children.
        knnChild1 = indices[child1]
        knnChild2 = indices[child2]
        knnChild3 = indices[child3]
        knnChild4 = indices[child4]
        knnChild5 = indices[child5]

        i = 0
        counter1 = 0
        counter2 = 0
        counter3 = 0
        counter4 = 0
        counter5 = 0

        # Loop through the nearest neighbors of each child
        # to see if our initial value appears as one of its neighbors.
        # If it appears, add 1 to counter.
        while i < len(knnChild1):
            if parent[0] == knnChild1[i]:
                counter1 += 1
            i += 1

        i = 0
        while i < len(knnChild2):
            if parent[0] == knnChild2[i]:
                counter2 += 1
            i += 1

        i = 0
        while i < len(knnChild3):
            if parent[0] == knnChild3[i]:
                counter3 += 1
            i += 1

        i = 0
        while i < len(knnChild4):
            if parent[0] == knnChild4[i]:
                counter4 += 1
            i += 1

        i = 0
        while i < len(knnChild5):
            if parent[0] == knnChild5[i]:
                counter5 += 1
            i += 1

        # Add all counters together to see how many times our value
        # appeared in all of the children's nearest neighbors.
        totalCounts = counter1 + counter2 + counter3 + counter4 + counter5

        print(totalCounts)
        # If it only appears once or less, it is of high risk.
        if totalCounts == 0:
            return 'high'

        # If it appears twice, it is of medium risk.
        elif totalCounts == 1:
            return 'medium'

        # If it appears more than twice, it is of low risk.
        elif totalCounts > 1:
            return 'low'


# Same as getCpuRisk() except using chrome usage instead of cpu usage
def getChromeRisk(id):
    cred = credentials.Certificate('./ServiceAccountKey.json')
    if not (firebase_admin.get_app()):
        firebase_admin.initialize_app(cred)
    db = firestore.client()

    doc_ref = db.collection('CPU Logs')
    query_ref = doc_ref.where(u'id', u'==', id)
    docs = query_ref.get()

    usage = 0
    for doc in docs:
        values = doc.to_dict()
        usage = values['chrome']

    if usage > 85:
        return 'high'
    else:
        X = np.array([[0, 0.0]])

        query_ref = doc_ref.where(u'testData', u'==', True).order_by(u'id', direction=firestore.Query.DESCENDING)
        docs = query_ref.get()

        for doc in docs:
            values = doc.to_dict()
            id = values['id']
            usage = values['chrome']
            X = np.insert(X, 0, np.array((id, usage)), 0)

        X = np.delete(X, len(X) - 1, 0)

        nbrs = NearestNeighbors(n_neighbors=6, algorithm='ball_tree', metric='euclidean').fit(X)

        distances, indices = nbrs.kneighbors(X)
        print(indices)
        parent = indices[len(X) - 1]

        child1 = parent[1]
        child2 = parent[2]
        child3 = parent[3]
        child4 = parent[4]
        child5 = parent[5]

        knnChild1 = indices[child1]
        knnChild2 = indices[child2]
        knnChild3 = indices[child3]
        knnChild4 = indices[child4]
        knnChild5 = indices[child5]

        i = 0
        counter1 = 0
        counter2 = 0
        counter3 = 0
        counter4 = 0
        counter5 = 0

        while i < len(knnChild1):
            if parent[0] == knnChild1[i]:
                counter1 += 1
            i += 1

        i = 0
        while i < len(knnChild2):
            if parent[0] == knnChild2[i]:
                counter2 += 1
            i += 1

        i = 0
        while i < len(knnChild3):
            if parent[0] == knnChild3[i]:
                counter3 += 1
            i += 1

        i = 0
        while i < len(knnChild4):
            if parent[0] == knnChild4[i]:
                counter4 += 1
            i += 1

        i = 0
        while i < len(knnChild5):
            if parent[0] == knnChild5[i]:
                counter5 += 1
            i += 1

        totalCounts = counter1 + counter2 + counter3 + counter4 + counter5

        if totalCounts == 0:
            return 'high'

        elif totalCounts == 1:
            return 'medium'

        elif totalCounts > 1:
            return 'low'


def getRiskValue(cpuRisk, chromeRisk):
      #CPU

#C    #########################
#H    #     # HI  # MED # LOW #
#R    #########################
#O    # HI  #  H  #  H  #  H  #
#M    # MED #  M  #  M  #  L  #
#E    # LOW #  L  #  L  #  L  #
      #########################

    if cpuRisk == 'high' and chromeRisk == 'high':
        return 'high'
    elif cpuRisk == 'high' and chromeRisk == 'medium':
        return 'high'
    elif cpuRisk == 'high' and chromeRisk == 'low':
        return 'high'
    elif cpuRisk == 'medium' and chromeRisk == 'high':
        return 'high'
    elif cpuRisk == 'medium' and chromeRisk == 'medium':
        return 'medium'
    elif cpuRisk == 'medium' and chromeRisk == 'low':
        return 'medium'
    elif cpuRisk == 'low' and chromeRisk == 'high':
        return 'high'
    elif cpuRisk == 'low' and chromeRisk == 'medium':
        return 'low'
    elif cpuRisk == 'low' and chromeRisk == 'low':
        return 'low'


# def updateRisk():
#     cpuRisk = ''
#
#     cred = credentials.Certificate('./ServiceAccountKey.json')
#     if not (firebase_admin.get_app()):
#         firebase_admin.initialize_app(cred)
#     db = firestore.client()
#
#     doc_ref = db.collection('CPU Logs')
#     X = np.array([[0, 0.0]])
#     Y = np.array([[0, 0.0]])
#
#     query_ref = doc_ref.where(u'testData', u'==', True).order_by(u'id', direction=firestore.Query.DESCENDING)
#     docs = query_ref.get()
#
#     for doc in docs:
#         values = doc.to_dict()
#         id = values['id']
#         usage = values['usage']
#         chrome = values['chrome']
#         X = np.insert(X, 0, np.array((id, usage)), 0)
#         Y = np.insert(Y, 0, np.array((id, chrome)), 0)
#
#     X = np.delete(X, len(X) - 1, 0)
#     Y = np.delete(Y, len(Y) - 1, 0)
#
#     nbrs = NearestNeighbors(n_neighbors=6, algorithm='ball_tree', metric='euclidean').fit(X)
#     nbrs2 = NearestNeighbors(n_neighbors=6, algorithm='ball_tree', metric='euclidean').fit(Y)
#
#     distances, indices = nbrs.kneighbors(X)
#     distances2, indices2 = nbrs2.kneighbors(Y)
#
#     k = 0
#
#     # Loop through all the logs in the database
#     # Recalculate the k nearest neighbor for each value
#     # Might change due to the addition of new log
#     while k < len(X) - 1:
#         parent = indices[k]
#         parent2 = indices2[k]
#
#         child1 = parent[1]
#         child2 = parent[2]
#         child3 = parent[3]
#         child4 = parent[4]
#         child5 = parent[5]
#         child6 = parent2[1]
#         child7 = parent2[2]
#         child8 = parent2[3]
#         child9 = parent2[4]
#         child10 = parent2[5]
#
#         knnChild1 = indices[child1]
#         knnChild2 = indices[child2]
#         knnChild3 = indices[child3]
#         knnChild4 = indices[child4]
#         knnChild5 = indices[child5]
#         knnChild6 = indices2[child6]
#         knnChild7 = indices2[child7]
#         knnChild8 = indices2[child8]
#         knnChild9 = indices2[child9]
#         knnChild10 = indices2[child10]
#
#         i = 0
#         j = 0
#         counter1 = 0
#         counter2 = 0
#         counter3 = 0
#         counter4 = 0
#         counter5 = 0
#         counter6 = 0
#         counter7 = 0
#         counter8 = 0
#         counter9 = 0
#         counter10 = 0
#
#         while i < len(knnChild1):
#             if parent[0] == knnChild1[i]:
#                 counter1 += 1
#             i += 1
#
#         while j < len(knnChild6):
#             if parent2[0] == knnChild6[j]:
#                 counter6 += 1
#             j += 1
#
#         i = 0
#         j = 0
#         while i < len(knnChild2):
#             if parent[0] == knnChild2[i]:
#                 counter2 += 1
#             i += 1
#         while j < len(knnChild7):
#             if parent2[0] == knnChild7[j]:
#                 counter7 += 1
#             j += 1
#
#         i = 0
#         j = 0
#         while i < len(knnChild3):
#             if parent[0] == knnChild3[i]:
#                 counter3 += 1
#             i += 1
#         while j < len(knnChild8):
#             if parent2[0] == knnChild8[j]:
#                 counter8 += 1
#             j += 1
#
#         i = 0
#         j = 0
#         while i < len(knnChild4):
#             if parent[0] == knnChild4[i]:
#                 counter4 += 1
#             i += 1
#         while j < len(knnChild9):
#             if parent2[0] == knnChild9[j]:
#                 counter9 += 1
#             j += 1
#
#         i = 0
#         j = 0
#         while i < len(knnChild5):
#             if parent[0] == knnChild5[i]:
#                 counter5 += 1
#             i += 1
#         while j < len(knnChild10):
#             if parent2[0] == knnChild10[j]:
#                 counter10 += 1
#             j += 1
#
#         toCheck = (k+1)*10
#         doc_ref = db.collection('CPU Logs')
#         query_ref = doc_ref.where(u'id', u'==', toCheck)
#         docs = query_ref.get()
#         for doc in docs:
#             documentId = doc.id
#         doc_ref = db.collection('CPU Logs').document(documentId)
#
#         totalCounts = counter1 + counter2 + counter3 + counter4 + counter5
#         totalCounts2 = counter6 + counter7 + counter8 + counter9 + counter10
#
#         if totalCounts <= 2:
#             cpuRisk = 'high'
#         elif totalCounts == 3:
#             cpuRisk = 'medium'
#         elif totalCounts > 3:
#             cpuRisk = 'low'
#
#         if totalCounts2 <= 2:
#             toSet = getRiskValue(cpuRisk, 'high')
#             doc_ref.update({
#                 u'riskValue': toSet
#             })
#         elif totalCounts2 == 3:
#             toSet = getRiskValue(cpuRisk, 'medium')
#             doc_ref.update({
#                 u'riskValue': toSet
#             })
#         elif totalCounts2 > 3:
#             toSet = getRiskValue(cpuRisk, 'low')
#             doc_ref.update({
#                 u'riskValue': toSet
#             })
#         k += 1
