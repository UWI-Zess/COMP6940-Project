import pickle
from enum import Enum

import pandas as pd
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

# Load the function and required data from the pickle file
with open('logit_regression_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('xgb_model.pkl', 'rb') as f:
    gb_model = pickle.load(f)


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


class RegionName(str, Enum):
    Midwest = "Midwest"
    Northeast = "Northeast"
    Other = "Other"
    South = "South"
    US_Territories = "U.S. Territories"
    West = "West"


class OffenderRace(str, Enum):
    American_Indian_or_Alaska_Native = "American Indian or Alaska Native"
    Asian = "Asian"
    Black_or_African_American = "Black or African American"
    Multiple = "Multiple"
    Native_Hawaiian_or_Other_Pacific_Islander = "Native Hawaiian or Other Pacific Islander"
    White = "White"


class OffenderCount(str, Enum):
    Few = "Few"
    Many = "Many"
    Several = "Several"


class VictimCount(str, Enum):
    Few = "Few"
    Many = "Many"
    Several = "Several"


class OffenseName(str, Enum):
    drug_crimes = "drug crimes"
    financial_crimes = "financial crimes"
    miscellaneous_crimes = "miscellaneous crimes"
    property_crimes = "property crimes"
    sexual_crimes = "sexual crimes"
    violent_crimes = "violent crimes"


class LocationName(str, Enum):
    Construction_Industrial = "Construction/Industrial"
    Education = "Education"
    Law_Enforcement = "Law Enforcement"
    Miscellaneous = "Miscellaneous"
    Outdoor_Nature = "Outdoor/Nature"
    Public_Place = "Public Place"
    Residence = "Residence"
    Retail = "Retail"


class Model(str, Enum):
    logit_regression = "logit_regression"
    gradient_boosting = "gradient_boosting"


def create_predictors_dict(
        region_name: RegionName,
        offender_race: OffenderRace,
        offender_count: OffenderCount,
        victim_count: VictimCount,
        offense_name: OffenseName,
        location_name: LocationName
):
    predictors = {
        'region_name_Midwest': region_name == RegionName.Midwest,
        'region_name_Northeast': region_name == RegionName.Northeast,
        'region_name_Other': region_name == RegionName.Other,
        'region_name_South': region_name == RegionName.South,
        'region_name_U.S. Territories': region_name == RegionName.US_Territories,
        'region_name_West': region_name == RegionName.West,
        'offender_race_American Indian or Alaska Native': offender_race == OffenderRace.American_Indian_or_Alaska_Native,
        'offender_race_Asian': offender_race == OffenderRace.Asian,
        'offender_race_Black or African American': offender_race == OffenderRace.Black_or_African_American,
        'offender_race_Multiple': offender_race == OffenderRace.Multiple,
        'offender_race_Native Hawaiian or Other Pacific Islander': offender_race == OffenderRace.Native_Hawaiian_or_Other_Pacific_Islander,
        'offender_race_White': offender_race == OffenderRace.White,
        'grouped_total_offender_count_Few': offender_count == OffenderCount.Few,
        'grouped_total_offender_count_Many': offender_count == OffenderCount.Many,
        'grouped_total_offender_count_Several': offender_count == OffenderCount.Several,
        'grouped_victim_count_Few': victim_count == VictimCount.Few,
        'grouped_victim_count_Many': victim_count == VictimCount.Many,
        'grouped_victim_count_Several': victim_count == VictimCount.Several,
        'generalized_offense_name_drug crimes': offense_name == OffenseName.drug_crimes,
        'generalized_offense_name_financial crimes': offense_name == OffenseName.financial_crimes,
        'generalized_offense_name_miscellaneous crimes': offense_name == OffenseName.miscellaneous_crimes,
        'generalized_offense_name_property crimes': offense_name == OffenseName.property_crimes,
        'generalized_offense_name_sexual crimes': offense_name == OffenseName.sexual_crimes,
        'generalized_offense_name_violent crimes': offense_name == OffenseName.violent_crimes,
        'generalized_location_name_Construction/Industrial': location_name == LocationName.Construction_Industrial,
        'generalized_location_name_Education': location_name == LocationName.Education,
        'generalized_location_name_Law Enforcement': location_name == LocationName.Law_Enforcement,
        'generalized_location_name_Miscellaneous': location_name == LocationName.Miscellaneous,
        'generalized_location_name_Outdoor/Nature': location_name == LocationName.Outdoor_Nature,
        'generalized_location_name_Public Place': location_name == LocationName.Public_Place,
        'generalized_location_name_Residence': location_name == LocationName.Residence,
        'generalized_location_name_Retail': location_name == LocationName.Retail
    }
    return predictors


@app.get("/predict")
async def predict(
        predictive_model: Model,
        region_name: RegionName,
        offender_race: OffenderRace,
        offender_count: OffenderCount,
        victim_count: VictimCount,
        offense_name: OffenseName,
        location_name: LocationName
):
    predictors = create_predictors_dict(region_name, offender_race, offender_count, victim_count, offense_name,
                                        location_name)
    predict_df = pd.DataFrame([predictors])
    if predictive_model == Model.logit_regression:
        prediction_result = model.predict(predict_df)
    else:
        prediction_result = gb_model.predict(predict_df)

    # log the prediction result
    if prediction_result[0] == 0:
        return {"prediction": "Race"}
    elif prediction_result[0] == 1:
        return {"prediction": "Religion"}
    elif prediction_result[0] == 2:
        return {"prediction": "Sexual Orientation"}
    return {"prediction": "Not found"}
