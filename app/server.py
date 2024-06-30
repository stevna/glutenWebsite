from Config import Config
from flask import Flask, render_template, request, Response, redirect,url_for, flash
import requests
import urllib.parse
from DB import Collection
from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from Model.User import User
import bcrypt
import re
from forms.register import Register
from forms.login import Login
import os
from Product import ProductEntry
from pprint import pprint
from pathlib import Path
from flask.blueprints import Blueprint
from backend import controller




app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')
app.secret_key = "lululalalelelellaeiafaefaefaef"

login_manager = LoginManager()
login_manager.init_app(app)

bp = Blueprint("lulu", __name__, static_folder="../image_uploads", static_url_path="res")

@login_manager.user_loader
def load_user(user_id):
    user = User.get_by_email(user_id)
    return user if user else None


@app.route('/')
def index():
    return redirect(url_for('login'))

@bp.route("/home")
def home():
    all_products = Collection("Products").find({})
    product_objects = [ProductEntry.convert_to_product(product) for product in all_products]

    variables = {
        "all_products": product_objects,
    }

    return render_template("content.html", **variables)

@app.route("/filter-products", methods=['GET'])
def filtered_products():
    filtered_products: list = controller.filter_products(request.args.to_dict())
    filtered_product_objects = [ProductEntry.convert_to_product(product) for product in filtered_products]

    variables = {
        "all_products": filtered_product_objects,
    }

    return render_template("all_products.html", **variables)


@app.route("/food", methods=['GET', 'POST'])
def add_food():
    data: dict = request.get_json()
    buy_place = data.get("buy_place", "" )
    if buy_place:
        vendor = buy_place.split(" ")[0]
        if "," in vendor:
            vendor = vendor.replace(",", "")
        print("vendor: ", vendor)
        data["vendor"] = vendor

    Collection("Products").insert_one(data)



@app.route("/upload-image", methods=['POST'])
def upload_image():
    file = request.files['file']
    if file:
        filepath = os.path.join(Config.upload_folder, file.filename)
        file.save(filepath)
        #return jsonify({'message': f'File uploaded successfully: {filename}'}), 201


@app.route("/register", methods=['GET', 'POST'])
def register():
    form = Register()
    if form.validate_on_submit():
        if request.method == 'POST':
            email = request.form["email"].lower()
            salt = bcrypt.gensalt()
            #password = bcrypt.hashpw(b'request.form["password"]', salt)
            password = bcrypt.hashpw(request.form["password"].encode('utf-8'), salt)
            print("hashed_password: ", password)
            find_user = User.get_by_email(email)
            if find_user is None:
                user = User.register(email, password)
                print("user: ", user)
                login_user(user)
                return redirect(url_for('home'))
            else:
                print("account already exists")
                flash('Diese Mailadresse wurde bereits registiert.')

    return render_template('auth/register.html', title='Register', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect('/home')
    form = Login()
    if form.validate_on_submit():
        email = request.form["email"].lower()
        password = request.form["password"]
        find_user = Collection("User").find_one({"email": email})
        if find_user and User.login_valid(email, password):
            loguser = User(**find_user)
            login_user(loguser)
            return redirect(url_for('home'))
        else:
            flash('Die Mailadresse und das Passwort stimmen nicht überein, bitte erneut eingeben.')
            print('Login Unsuccessful. Please check email and password', 'danger')

    return render_template('auth/login.html', title='Login', form=form)

@app.route("/logout", methods=['GET'])
def logout():
    logout_user()
    return redirect('/login')


def encode_url(url):
    return urllib.parse.quote(url)



app.register_blueprint(bp, url_prefix="/")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8555, debug=True)