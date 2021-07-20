from flask import Flask, request, Response, make_response, jsonify
import psycopg2
import json
import requests
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
CORS(app, support_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/signup", methods=['POST', 'GET'])
@cross_origin()
def retrieve():
    x = request.get_data()
    user = json.loads(x)

    print(user)
    first_name = user["first_name"]
    last_name = user["last_name"]
    email = user["email"]
    password = user["password"]
    

    try:
        connection = psycopg2.connect(user="cespinosa", password="postgres", host="localhost", port="5432", dbname="events")
        cursor = connection.cursor()

        cursor.execute(""" SELECT email FROM users WHERE email = %s""", (email, ))
        data = cursor.fetchone()
        print(data)

        if(data is None):
            postgres_insert_query = """ INSERT INTO users(fname, lname, email, password) VALUES (%s,%s,%s,%s)"""
            record_to_insert = (first_name, last_name, email, password)
            cursor.execute(postgres_insert_query, record_to_insert)

            connection.commit()
            count = cursor.rowcount
            print (count, "Record inserted successfully into mobile table")
        else:
            return 404, 'user already exist'

    except (Exception, psycopg2.Error) as error :
        if(connection):
            print("Failed to insert record into mobile table", error)

    finally:
        #closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
            
    return "send"


@app.route("/login", methods=['POST', 'GET'])
@cross_origin()
def login():    

    x = request.get_data()
    user = json.loads(x)

    email = user["email"]
    password = user["password"]
    
    try:
        connection = psycopg2.connect(user="cespinosa", password="postgres", host="localhost", port="5432", dbname="events")
        cursor = connection.cursor()

        #verify db to login
        cursor.execute(""" SELECT uid, fname, lname, email, password FROM users WHERE email = %s and password = %s""", (email, password))
        data = cursor.fetchone()
        returnUser = {
            "uid"  : data[0],
            "fname": data[1],
            "lname": data[2],
            "email": data[3]
        }
        if(data is not None):
            print("correct input")
            return returnUser, 200

        else:
            print("no match in DB")
            return Response("", status=404)


    except (Exception, psycopg2.Error) as error :
        if(connection):
            print("Failed to login", error)
            return Response("", status=404)

    finally:
        #closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


@app.route("/showEvents", methods=['POST', 'GET', 'OPTIONS'])
@cross_origin()
def showEvents():

    x = request.get_data()
    data = json.loads(x)
    uid = data["uid"]
    #day = data["date"]

    try:
        connection = psycopg2.connect(user="cespinosa", password="postgres", host="localhost", port="5432", dbname="events")
        cursor = connection.cursor()

        #fetch events from user
        cursor.execute(""" SELECT users.uid, events.eventname, events.day, events.starttime, events.endtime
                            FROM users
                            INNER JOIN events ON users.uid=events.uid
                            WHERE users.uid = %s
                            ORDER by events.day ASC;""", (uid, ))
        events = cursor.fetchall()
        print(events)

    #function to return dictionary
        eventsD = {}
        for i, event in enumerate(events, start = 1):
            eventsI = {
                "Event" + str(i):{
                    "eventName": event[1],
                    "date": event[2],
                    "startTime": event[3],
                    "endTime": event[4]
                }
            }
            eventsD.update(eventsI)
            
        return json.dumps(eventsD, indent=4, sort_keys=True, default=str), 200
        

    except (Exception, psycopg2.Error) as error :
        if(connection):
            print("error", error)
            return Response("", status=404)

    finally:
        #closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")



@app.route("/addEvents", methods=['POST', 'GET', 'OPTIONS'])
@cross_origin()
def addEvents():
    x = request.get_data()
    event = json.loads(x)


    print(event)

    uid = event["uid"]
    eventname = event["eventname"]
    starttime = event["starttime"]
    endtime = event["endtime"]
    day = event["day"]

    try:
        connection = psycopg2.connect(user="cespinosa", password="postgres", host="localhost", port="5432", dbname="events")
        cursor = connection.cursor()

        postgres_insert_query = """ INSERT INTO events(uid, eventname, starttime, endtime, day) VALUES (%s,%s,%s,%s,%s)"""
        record_to_insert = (uid, eventname, starttime, endtime, day)
        cursor.execute(postgres_insert_query, record_to_insert)

        connection.commit()
        count = cursor.rowcount
        print (count, "Record inserted successfully into mobile table")

        return 'OK', 200

    except (Exception, psycopg2.Error) as error :
        if(connection):
            print("Failed to insert record into mobile table", error)

    finally:
        #closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")



app.run(host='0.0.0.0', debug=True)