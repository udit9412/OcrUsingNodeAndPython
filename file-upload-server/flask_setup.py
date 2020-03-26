from flask import Flask, request
import json
 
app = Flask(__name__)
 
@app.route('/')
def index():
	return "Flask server"
 
@app.route('/postdata', methods = ['POST'])
def postdata():
    data = request.get_json()
    print(data)
    # do something with this data variable that contains the data from the node server
    return json.dumps({"newdata":"hereisthenewdatayouwanttosend"})
 
if __name__ == "__main__":
    print("APP running on 5000")
	app.run(port=5000)