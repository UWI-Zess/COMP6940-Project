import pandas as pd
import pickle

data = pd.read_csv('cleaned_hate_crime_forecasting.csv')
data['incident_date'] = pd.to_datetime(data['incident_date'])
data['year'] = data['incident_date'].dt.year
data_year = data.groupby('year').size().reset_index(name='Number of incidents')


def predict_hate_crimes(year, data_year, best_alpha=0.99):
    pred = []
    # Find the number of incidents by year for the training set calculates the exponential weighted moving average (
    # EWMA) of the historical data (data_year) for the 'Number of incidents' column.
    ft = pd.DataFrame.ewm(data_year, span=10).mean()['Number of incidents'].iloc[-1]
    # appends the forecasted value to the pred list
    pred.append(ft)
    # Predict the number of incidents for the future years iterates over each year starting from the year after the
    # latest year in the historical data (data_year) up to the specified year
    for i in range(1, year - data_year['year'].iloc[-1] + 1):
        # This line predicts the number of incidents for the next year using exponential smoothing. combines the
        # forecasted value for the latest year in the historical data with the previous forecasted value (ft),
        # weighted by the best alpha value.
        ft_plus_1 = best_alpha * data_year['Number of incidents'].iloc[-1] + (1 - best_alpha) * ft
        pred.append(ft_plus_1)
        ft = ft_plus_1
    return pred[-1]


# Serialize the function and required variables
function_data = {
    'predict_hate_crimes': predict_hate_crimes,
    'data_year': data_year,  # Pass data_year along with the function
}

# Save the serialized object to a pickle file
with open('forecasting_model.pkl', 'wb') as f:
    pickle.dump(function_data, f)
