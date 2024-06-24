from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, validators
from wtforms.validators import DataRequired, Email, ValidationError
import re

def email_validator(form, field):
  if not re.match(r"[^@]+@[^@]+\.[a-zA-Z]{2,}", field.data):
      print("email not working")
      raise ValidationError("Invalid email format")

class Register(FlaskForm):
    email = StringField('Email',validators=[DataRequired(), email_validator])
    password = PasswordField('Password', validators=[
        validators.DataRequired(),
        validators.length(min=6, max=35),
        validators.EqualTo('password_verify', message='Passwörter müssen identisch sein    ')
    ])
    password_verify = PasswordField('Verify Password')
    login = SubmitField('Login')