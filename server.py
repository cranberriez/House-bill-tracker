from flask import Flask, request, url_for, render_template
import uuid, json
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        userData[request.form["uuid"]] = request.form
        save_userData(userData)
        return "done"
    return "done"
    # get response:

def create_uuid():
    return uuid.uuid1()

def save_userData(userData):
    with open('./data/users.json', 'w') as outfile:
        print("Saved user data")
        print(userData)
        json.dump(userData, outfile, indent=4)

def load_userData():
    with open('./data/users.json') as infile:
        data = json.load(infile)
        print("Loaded user data")
        print(data)
        return data

userData = load_userData()