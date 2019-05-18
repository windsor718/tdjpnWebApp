#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template
from flask import request, jsonify
import json
import pandas as pd
import xarray as xr

import add

app = Flask(__name__)
app.register_blueprint(add.dir1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data', methods=['POST'])
def returnJson():
    post = request.get_json(force=True)
    name = post["name"]
    ID = post["ID"]
    out = queryHydrograph(name, ID)
    return json.dumps(out)

@app.route("/init", methods=["POST"])
def returnDatetimeJson():
    print(request)
    post = request.get_json(force=True)
    print(post)
    filename = post["filename"]
    with open("archive/%s"%filename) as f:
        return json.dumps(json.load(f))
    

def queryHydrograph(name, ID):
    data = xr.open_dataset("archive/%s.nc"%name).sel(ID=ID.encode()).to_array()
    dates = data["datetime"].values
    values = data.values[0]
    out = [ dict([("dates",pd.to_datetime(dates[i]).strftime("%Y-%m-%d-%H -00")),("values",float(values[i]))]) for i in range(0, len(values)) ]
    return out

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080, debug=True)
