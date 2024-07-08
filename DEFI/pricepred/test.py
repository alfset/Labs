import requests
import pandas as pd
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
import time

def fetch_historical_prices(coin_id, vs_currency, days):
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {
        'vs_currency': vs_currency,
        'days': days,
        'interval': 'daily'
    }
    response = requests.get(url, params=params)
    data = response.json()
    return data

def fetch_validator_data(days, validator_address):
    base_url = "https://lcd.orai.io"
    
    validator_data = []
    for i in range(days):
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        uptime_url = f"{base_url}/cosmos/staking/v1beta1/validators/{validator_address}/uptime?date={date}"
        uptime_response = requests.get(uptime_url)
        uptime_data = uptime_response.json()
        uptime = uptime_data.get('uptime', 99)
        jail_url = f"{base_url}/validators/{validator_address}/jail?date={date}"
        jail_response = requests.get(jail_url)
        jail_data = jail_response.json()
        jail = jail_data.get('jailed', False)
        
        validator_data.append({
            'date': datetime.now() - timedelta(days=i),
            'uptime': uptime,
            'jail': 1 if jail else 0
        })
        time.sleep(1)
        
    return validator_data

def calculate_validator_sentiment(validator_data):
    sentiment_scores = []
    for record in validator_data:
        sentiment = record['uptime'] / 100.0
        if record['jail'] == 1:
            sentiment -= 0.5 
        sentiment_scores.append({
            'date': record['date'],
            'sentiment': sentiment
        })
    return sentiment_scores

def process_coin(coin_id, vs_currency, days, validator_address):
    historical_data = fetch_historical_prices(coin_id, vs_currency, days)
    print(f"Historical data for {coin_id}: {historical_data}")

    prices = historical_data['prices']
    df_prices = pd.DataFrame(prices, columns=['timestamp', 'price'])
    df_prices['date'] = pd.to_datetime(df_prices['timestamp'], unit='ms')
    df_prices = df_prices[['date', 'price']]

    validator_data = fetch_validator_data(days, validator_address)
    sentiment_data = calculate_validator_sentiment(validator_data)
    df_sentiment = pd.DataFrame(sentiment_data)
    
    df = pd.merge(df_prices, df_sentiment, on='date', how='left')
    df['date_ordinal'] = df['date'].map(datetime.toordinal)
    df = df.fillna(0) 

    X = df[['date_ordinal', 'sentiment']]
    y = df['price']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    r2 = model.score(X_test, y_test)
    print(f"Model R^2 score for {coin_id}: {r2}")
    print(f"Mean Absolute Error (MAE) for {coin_id}: {mae}")
    print(f"Mean Squared Error (MSE) for {coin_id}: {mse}")

    future_dates = [datetime.now() + timedelta(days=i) for i in range(1, 8)]
    future_dates_ordinal = [date.toordinal() for date in future_dates]
    future_sentiment = [0] * len(future_dates)  
    future_X = pd.DataFrame({
        'date_ordinal': future_dates_ordinal,
        'sentiment': future_sentiment
    })

    future_prices = model.predict(future_X)
    predictions = pd.DataFrame({
        'date': future_dates,
        'predicted_price': future_prices
    })
    print(f"Predictions for {coin_id}:")
    print(predictions)
    return predictions, sentiment_data

coins_input = input("Enter your search query: ").split()
vs_currency = 'usd'
days = 30
validator_address = input("Enter your validator address: ")

all_predictions = {}
all_sentiments = {}
for coin_id in coins_input:
    predictions, sentiment_data = process_coin(coin_id, vs_currency, days, validator_address)
    all_predictions[coin_id] = predictions
    all_sentiments[coin_id] = sentiment_data
    time.sleep(5)

print("All predictions:")
for coin_id, predictions in all_predictions.items():
    print(f"\n{coin_id} predictions:")
    print(predictions)

print("\nValidator Sentiments:")
for coin_id, sentiment_data in all_sentiments.items():
    print(f"\n{coin_id} sentiments:")
    for record in sentiment_data:
        print(f"Date: {record['date'].strftime('%Y-%m-%d')}, Sentiment: {record['sentiment']:.2f}")
