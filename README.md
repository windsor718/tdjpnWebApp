# Web application of the flood forecasting system, IGAR-F3.  
This is a source code of the web application of Integrated Global And Regional Framework for Flood Forecasting (IGAR-F3).  
The system is operated on Data Integration and Analysis System (DIAS; operated by METI and UTokyo) in Japan.  

## Frontend  
HTML5, CSS3, Javascript6:  
- D3.js  
- jQuery  
- pickadate.js  
- leaflet.js  
  
## Backend  
Python3:  
- Flask  
- numpy  
- Pandas  
- xArray  
- geopandas  
The POST request from the client will be handled by those python data libralies. xArray is a main backend to query the data, as it supports lazy loading.  
  

