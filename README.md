# Hate Crime Analysis
# Dataset 
The dataset used for this project is the Hate Crime dataset from the FBI. The dataset can be found [here](https://ucr.fbi.gov/hate-crime).

# API
Look at the [Fast API documentation to learn more](https://fastapi.tiangolo.com/) to learn more.

Uvicorn is used to run the API. Uvicorn is a lightning-fast ASGI server implementation, using uvloop and httptools. Learn more about Uvicorn [here](https://www.uvicorn.org/).

## Setup

Make sure to install the dependencies:

```bash
pip install uvicorn     
```

## Change the directory to the API folder, example:

```bash
cd /Users/user/Desktop/COMP6940-Project/API
```

## Run the API

```bash
uvicorn main:app --reload
```

## Open the browser and go to the following URL:

```
http://127.0.0.1:8000/docs
```
