from flask import Flask, request, url_for, render_template
import uuid
app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        print(request.form)
        return "done"
    return "done"
    # get response:

def create_uuid():
    return uuid.uuid1()

def save_userData(userData):

def load_userData():