from flask import Flask ,session, render_template, request, redirect, Response , jsonify , url_for , g
import RPi.GPIO as GPIO
import random,json
import sys
import MySQLdb
import pyshark
import os
import signal
import subprocess
from EmailMod import send_smtp
import hashlib
from flask_login import LoginManager
from flask_login import UserMixin , current_user, login_user

app=Flask(__name__ , static_folder='static', static_url_path='/static')
app.secret_key = os.urandom(24)
db = MySQLdb.connect("localhost", "monitor", "p@ssw0rd", "LogCollection" , autocommit=True)
computerState = 0;
networkState = 0;
out_string = ""
i = 1

login = LoginManager(app)


@app.route('/')
def loginPage():
    
    return render_template('mainPage.html')    

@app.route('/home')
def collectLog():
    print("running")
    computerState = 0;
    networkState = 0;
    curs=db.cursor()
    curs.execute("SELECT * FROM states")
    
    
    for row in curs:
        computerState = row[2]
        networkState = row[1]
        
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
        p = subprocess.Popen(["python", "networkLogScript.py"])
    else:
        p.kill()
    
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

@app.route('/login' , methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        userName = request.form['userName']
        password = request.form['password']
        session.pop('user', None)
   
        dbPassword = ""  
        hash_object = hashlib.sha512(b"%s" % (password))
        hex_dig = hash_object.hexdigest()
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

