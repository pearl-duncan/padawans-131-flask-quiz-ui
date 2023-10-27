from . import auth_blueprint as auth
from flask import request, make_response
from ..models import User
from flask_jwt_extended import create_access_token

@auth.post('/register')
def handle_register():
    body = request.json

    if body is None:
        response = {
            'message': "username and password are required"
        }
        return response, 400
    
    username = body.get('username')
    if username is None:
        response = {
            'message': 'username is required'
        }
        return response, 400
    
    existing_user = User.query.filter_by(username=username).one_or_none()
    if existing_user is not None:
        response = {
            'message': 'username is already in use'
        }
    
    password = body.get('password')
    if password is None:
        response = {
            'message': 'password is required'
        }
        return response, 400
    
    user = User(username=username, password=password)
    user.create()

    response = {
        'message': 'user registered',
        'data': user.to_response()
    }
    return response, 201

@auth.post('/login')
def handle_login():
    body = request.json

    if body is None:
        response = {
            'message': "username and password are required"
        }
        return response, 400
    
    username = body.get('username')
    if username is None:
        response = {
            'message': 'username is required'
        }
        return response, 400
    
    existing_user = User.query.filter_by(username=username).one_or_none()
    if existing_user is not None:
        response = {
            'message': 'username is already in use'
        }
    
    password = body.get('password')
    if password is None:
        response = {
            'message': 'password is required'
        }
        return response, 400
    
    user = User(username=username).one_or_none()
    if user is None:
        response = {
            'message': "please creat an account before loggin in"
        }
        return response, 400
    
    ok = user.compare_password(password)
    if not ok:
        response = {
            'message': 'invalid credentials'
        }
        return response, 401
    
    auth_token = create_access_token(identity=user.id)

    response = make_response({'message':"successfully logged in"})
    response.headers["Authorization"] = f"Bearer {auth_token}"
    return response, 200