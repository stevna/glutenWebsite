from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, validators
from wtforms.validators import DataRequired


class Login(FlaskForm):
    email = StringField('Email', validators = [DataRequired(), validators.Length(min=6, max=35)])
    password = PasswordField('Password', validators=[DataRequired()])
    login = SubmitField('Login')