import pickle
from fastapi import FastAPI, Query
from sqlalchemy import create_engine, Column, Integer, String, Date, func
from sqlalchemy.orm import sessionmaker, declarative_base
import csv
from datetime import datetime
from typing import List, Tuple
import prediction

# Define the SQLite database connection
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for our SQLAlchemy models
Base = declarative_base()


# Define a model for our database table
class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String, index=True)
    incident_date = Column(Date, index=True)
    total_offender_count = Column(Integer)
    offender_race = Column(String)
    victim_count = Column(Integer)
    offense_name = Column(String)
    location_name = Column(String)
    bias_desc = Column(String)
    victim_types = Column(String)


# Create the database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()


# Function to read data from CSV file and add it to the database
def load_data_from_csv():
    with open('hate_crime_2010.csv', 'r') as file:
        reader = csv.DictReader(file)
        # check if the data is already loaded
        db = SessionLocal()
        if db.query(Incident).count() > 0:
            return
        incidents = []
        for row in reader:
            incident_date = datetime.strptime(row['incident_date'], '%Y-%m-%d').date()
            incidents.append(Incident(
                id=int(row['incident_id']),
                state_name=row['state_name'],
                location_name=row['location_name'],
                offender_race=row['offender_race'],
                victim_types=row['victim_types'],
                bias_desc=row['bias_desc'],
                incident_date=incident_date,
                victim_count=int(row['victim_count']),
                total_offender_count=int(row['total_offender_count']),
                offense_name=row['offense_name']
            ))
    db = SessionLocal()
    db.add_all(incidents)
    db.commit()
    db.close()


# Load data from CSV into the database
load_data_from_csv()

# Load the function and required data from the pickle file
with open('forecasting_model.pkl', 'rb') as f:
    function_data = pickle.load(f)

predict_hate_crimes = function_data['predict_hate_crimes']
data_year = function_data['data_year']


@app.get("/")
def home():
    return {"message": "Welcome to Hate Crime API"}


# Parse filter string to extract filters
def parse_filters(filters: str) -> List[Tuple[str, str, str]]:
    filter_list = []
    for f in filters.split('&'):
        parts = f.split('=')
        field = parts[0].split('[')[1].replace(']', '')
        operation = parts[0].split('[')[2].replace(']', '')
        value = parts[1]
        filter_list.append((field, operation, value))
    return filter_list


# GET endpoint to fetch paginated incidents from the database with filtering options
@app.get("/incidents")
def get_incidents(
        state_name: str = None,
        location_name: str = None,
        offender_race: str = None,
        victim_types: str = None,
        bias_desc: str = None,
        incident_date: datetime = None,
        victim_count: int = None,
        total_offender_count: int = None,
        offense_name: str = None,
        incident_year: int = Query(None, ge=2000, le=2020),
        incident_month: int = Query(None, ge=1, le=12),
        _filters: str = None,
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=100),
):
    db = SessionLocal()
    query = db.query(Incident)
    if state_name is not None:
        query = query.filter(Incident.state_name.like(f"%{state_name}%"))
    if location_name is not None:
        query = query.filter(Incident.location_name.like(f"%{location_name}%"))
    if offender_race is not None:
        query = query.filter(Incident.offender_race.like(f"%{offender_race}%"))
    if victim_types is not None:
        query = query.filter(Incident.victim_types.like(f"%{victim_types}%"))
    if bias_desc is not None:
        query = query.filter(Incident.bias_desc.like(f"%{bias_desc}%"))
    if incident_date is not None:
        query = query.filter(Incident.incident_date == incident_date)
    if victim_count is not None:
        query = query.filter(Incident.victim_count == victim_count)
    if total_offender_count is not None:
        query = query.filter(Incident.total_offender_count == total_offender_count)
    if offense_name is not None:
        query = query.filter(Incident.offense_name.like(f"%{offense_name}%"))
    if incident_year is not None:
        query = query.filter(Incident.incident_date >= datetime(incident_year, 1, 1))
        query = query.filter(Incident.incident_date <= datetime(incident_year, 12, 31))
    if incident_month is not None:
        query = query.filter(Incident.incident_date >= datetime(incident_year, incident_month, 1))
        query = query.filter(Incident.incident_date <= datetime(incident_year, incident_month, 31))

    # Apply additional filters
    if _filters:
        filters_list = parse_filters(_filters)
        for field, operation, value in filters_list:
            field_name = getattr(Incident, field, None)
            if field_name is not None:
                if operation == "eq":
                    query = query.filter(field_name == value)
                elif operation == "gt":
                    query = query.filter(field_name > value)
                elif operation == "lt":
                    query = query.filter(field_name < value)

    total_count = query.count()
    incidents = query.offset(skip).limit(limit).all()
    db.close()
    return {"total": total_count, "incidents": incidents}


@app.get("/forecast")
async def predict(year: int):
    result = predict_hate_crimes(year, data_year)
    return {"predicted_hate_crimes": result}
