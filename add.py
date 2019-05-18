from flask import Blueprint

dir1 = Blueprint("archive", __name__,
    static_url_path='/archive', static_folder='./archive'
)
