from flask import Flask ,session, render_template, request, redirect, Response , jsonify , url_for , g , send_file
import RPi.GPIO as GPIO
import random,json
import sys
#import MySQLdb
import pymysql
import pyshark
import os
import signal
import subprocess
from subprocess import Popen, PIPE
from EmailMod import send_smtp
import hashlib
#import dpkt
#, pcap
import time
from flask_login import LoginManager
from flask_login import UserMixin , current_user, login_user

app=Flask(__name__ , static_folder='static', static_url_path='/static')
app.secret_key = os.urandom(24)
db = pymysql.connect("127.0.0.1", "monitor", "p@ssw0rd", "LogCollection" , autocommit=True)
computerState = 0;
networkState = 0;
out_string = ""
i = 1



login = LoginManager(app)


@app.route('/')
def loginPage():
    
    return render_template('mainPage.html')

@app.route('/return-files/')
def return_files_tut():
	try:
		return send_file('/home/pi/Desktop/Project/Logs/logs.pcap', as_attachment=True,attachment_filename='logs.pcap')
	except Exception as e:
		return str(e)
	    
@app.route('/return-text/')
def return_txt():
	try:
		return send_file('/home/pi/Desktop/Project/Logs/logs.txt', as_attachment=True,attachment_filename='logs.txt')
	except Exception as e:
		return str(e)


@app.route('/home')
def collectLog():
    print("running")
    computerState = 0;
    networkState = 0;
    curs=db.cursor()
    curs.execute("SELECT * FROM states")
    
    
    for row in curs:
        computerState = row[1]
        networkState = row[2]
        
    curs.close()

    if g.user:
        return render_template('index.html', computerState = computerState, networkState = networkState )

    
    return redirect(url_for('loginPage'))  
     
    
@app.route('/network',methods=['POST'])
def networkSwitch():
    curs=db.cursor()
    rf=request.get_json()
    key = rf['networkstate']
    print(key)
    networkState = int(key)
    curs.execute("UPDATE states SET networkState = %d WHERE state = 1" % (networkState))
    curs.close()
    db.commit()
    
    if networkState == 1:
        p = subprocess.Popen(['sudo', "python3", "/home/pi/Desktop/Project/networkLogScript.py"], preexec_fn=os.setsid)
        px = subprocess.Popen(['sudo' ,"python", "/home/pi/Desktop/Project/testingLog.py"], preexec_fn=os.setsid)
        
        #a = subprocess.check_output(['sudo vnstat -l -i wlan1'], shell=True)
        #print(a)
           
    else:
        
        os.killpg(os.getpgid(p.pid), signal.SIGTERM)
        os.killpg(os.getpgid(px.pid), signal.SIGTERM)
        p.terminate()
        px.terminate()
        p.kill()
        px.kill()
    return key

@app.route('/computer',methods=['POST'])
def computerSwitch():
    curs=db.cursor()
    rf=request.get_json()
    key = rf['computerState']
    print(key)
    computerState = int(key)
    curs.execute("UPDATE states SET computerState = %d WHERE state = 1" % (computerState))
    curs.close()
    db.commit()
    
    if computerState == 1:
        #x = subprocess.Popen(["python3", "socketListener.py"],preexec_fn=os.setsid)
        ppxx = subprocess.Popen(["python", "/home/pi/Desktop/Project/socketListenerBandwidth.py"], preexec_fn=os.setsid)
        #a = subprocess.check_output(['sudo vnstat -l -i wlan1'], shell=True)
        #print(a)
           
    else:
        os.killpg(os.getpgid(x.pid), signal.SIGTERM)
        x.kill()
    
        
    return key

@app.route('/mail' ,methods=['POST'])
def sendMail():
    rf=request.get_json()
    name = rf['name']
    email = rf['email']
    message = rf['message']
    print("sendMail Running")
    
    send_smtp(name,'plain',message,'Contacted Us : %s ' % (email))
    return name

@app.route('/hostapd' , methods=['GET', 'POST'])
def hostapd():
    print("hostapd Running")
    if request.method == 'POST':
        outString2 = ""
        print("hostapd Running Post")
        rf=request.get_json()
        userName = rf['userName']
        password = rf['password']
        print(userName)
        print(password)
        #os.system("sudo systemctl stop hostapd")
        #import os
        #stopService = os.system("sudo /etc/init.d/hostapd stop")
        #import subprocess
        #stopService = subprocess.call('sudo /etc/init.d/hostapd stop', shell=True)
        time.sleep(2)
        
        out_file = open("../../../../etc/hostapd/hostapd.conf", "w")
        outString2 += "interface=wlan1\nbridge=br0\n#driver=nl80211\nssid="
        outString2 += userName
        outString2 += "\nhw_mode=g\nchannel=7\nwmm_enabled=0\nmacaddr_acl=0\nauth_algs=1\nignore_broadcast_ssid=0\nwpa=2\nwpa_passphrase="
        outString2 += password
        outString2 += "\nwpa_key_mgmt=WPA-PSK\nwpa_pairwise=TKIP\nrsn_pairwise=CCMP"
        out_file.write(outString2)
        print(outString2)
        #time.sleep(5)
        #import subprocess
        #startService = subprocess.call('sudo /etc/init.d/hostapd start', shell=True)
        #startService = os.system("sudo /etc/init.d/hostapd start")
        #import os
        #os.system("sudo /etc/init.d/hostapd start restart")
        #time.sleep(5)
        #stopService2 = subprocess.call('sudo /etc/init.d/hostapd stop', shell=True)
        #time.sleep(20)
        
        #import os
        
        #os.system('sudo shutdown -r -t 30')
        #stopService2 = subprocess.call('sudo sudo shutdown -r +1', shell=True)
        #startService2= subprocess.call('sudo /etc/init.d/hostapd start', shell=True)
    #startService2= 
    return startProcess() #subprocess.Popen(["python", "Shutdown.py"])
        
        #os.system("sudo systemctl start hostapd")
       
def startProcess():
    subprocess.Popen(["python", "/home/pi/Desktop/Project/Shutdown.py"])



@app.route('/login' , methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        userName = request.form['userName']
        password = request.form['password']
        session.pop('user', None)
   
        dbPassword = ""  
        hash_object =  hashlib.sha512(password.encode())
        hex_dig = hash_object.hexdigest()
        print(hex_dig)
        print("login Running")
        curs=db.cursor()
        rows_count = curs.execute("SELECT * FROM userAccount WHERE username= '%s'" % (userName))
    
        if rows_count > 0:
            for row in curs:
                dbPassword  = row[1]
    
      
      
          
        curs.close()
    
        if(dbPassword == hex_dig):
            print("run redirect")
            session['user'] = request.form['userName'] 
            return redirect(url_for('collectLog'))   
     
    
        return redirect(url_for('loginPage'))  



@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']

@app.route('/getsession')
def getsession():
    if 'user' in session:
        return session['user']

    return 'Not logged in!'

@app.route('/dropsession')
def dropsession():
    session.pop('user', None)
    return 'Dropped!'

@app.route('/logout' ,methods=['GET', 'POST'])
def logout():
    session.pop('user', None)
    return redirect(url_for('loginPage')) 

if __name__  == '__main__':
	app.run(host='0.0.0.0')

