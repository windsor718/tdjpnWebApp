#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template
from flask import request, jsonify
import json

app = Flask(__name__)


@app.route('/')
def index():
   return render_template('index.html')

@app.route('/data', methods=['POST'])
def returnJson():
   #out = {"dates":["2017-05-01","2018-05-01","2019-05-01"],"values":[0,1,1]}
   #out = {"dates":[10,100,200],"values":[0,1,1]}
   out = [{"dates":10,"values":0},{"dates":20,"values":1},{"dates":100,"values":10}]
   #out = [{"dates":"2019-05-01","values":0},{"dates":"2019-05-02","values":1},{"dates":"2019-05-03","values":10}]
   #out = {"date":"2019-05-14","value":20}
   #return jsonify(ResultSet=json.dumps(out))
   return json.dumps(out)

if __name__ == '__main__':
   app.run(host="127.0.0.1", port=8080, debug=True)
