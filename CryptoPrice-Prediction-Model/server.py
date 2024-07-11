from flask import Flask, request, jsonify, render_template
import pandas as pd
from datetime import datetime, timedelta 
import numpy as np
import time
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import requests
import threading
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import logging

app = Flask(__name__)

# Logging configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Global variables
vs_currency = 'usd'
days = 30  # Fetching 2 days of hourly data
update_interval_hours = 1  # Update data and predictions every 1 hour
price_update_interval_minutes = 60  # Update real-time price every 1 hour

# Variables to store data and predictions
predictions = {}
historical_prices = {}
mae = {}
mse = {}
r2 = {}
real_time_prices = {}  

# Default coin ID if not specified in URL
default_coin_id = 'bitcoin'

# Function to fetch historical prices
def fetch_historical_prices(coin_id, vs_currency, days):
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {
        'vs_currency': vs_currency,
        'days': days,
    }
    response = requests.get(url, params=params)
    data = response.json()
    print(data)
    return data

# Function to calculate momentum and breakout
def calculate_momentum_and_breakout(df_prices):
    # Calculate Momentum (1-hour)
    df_prices['momentum_1d'] = df_prices['price'].diff(1)  # 1-hour momentum
    
    # Calculate Breakout (threshold: 5%)
    threshold = 0.05
    df_prices['breakout'] = np.where(df_prices['price'].pct_change().abs() > threshold, 1, 0)
    
    return df_prices

# Update data function
def update_data(coin_id):
    try:
        historical_data = fetch_historical_prices(coin_id, vs_currency, days)
        prices = historical_data['prices']
        df_prices = pd.DataFrame(prices, columns=['timestamp', 'price'])
        df_prices['timestamp'] = pd.to_datetime(df_prices['timestamp'], unit='ms')

        df_prices = df_prices.groupby('timestamp').mean().reset_index()

        # Calculate momentum and breakout
        df_prices = calculate_momentum_and_breakout(df_prices)
        
        historical_prices[coin_id] = df_prices
        
        X = df_prices['timestamp'].apply(datetime.toordinal).values.reshape(-1, 1)
        y = df_prices['price'].values

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = LinearRegression()
        model.fit(X_train, y_train)

        future_hours = [datetime.now() + timedelta(hours=i) for i in range(1, 25)]
        future_hours_ordinal = [timestamp.toordinal() for timestamp in future_hours]

        future_X = pd.DataFrame({
            'timestamp_ordinal': future_hours_ordinal,
        })

        future_prices = model.predict(future_X)

        log_returns = np.diff(np.log(y))
        volatility_factor = np.std(log_returns)

        future_prices += volatility_factor * future_prices * np.random.randn(len(future_prices))

        predictions[coin_id] = pd.DataFrame({
            'timestamp': future_hours,
            'predicted_price': future_prices,
            'volatility_factor': volatility_factor
        })

        # Calculate MSE, MAE, and R2
        y_pred = model.predict(X_test)
        mae[coin_id] = mean_absolute_error(y_test, y_pred)
        mse[coin_id] = mean_squared_error(y_test, y_pred)
        r2[coin_id] = r2_score(y_test, y_pred)

        logger.info(f"Updated data for coin_id {coin_id}")
        
    except Exception as e:
        logger.error(f"Error occurred during data update for coin_id {coin_id}: {str(e)}")
      
# Function to update real-time prices
def update_real_time_prices(coin_ids):
    while True:
        try:
            for coin_id in coin_ids:
                current_price_url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd"
                current_price_response = requests.get(current_price_url)
                current_price_data = current_price_response.json()
                current_price = current_price_data[coin_id]['usd']
                
                if coin_id not in real_time_prices:
                    real_time_prices[coin_id] = []
                
                real_time_prices[coin_id].append({
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'price': current_price
                })
                
                if len(real_time_prices[coin_id]) > 10:
                    real_time_prices[coin_id].pop(0)
                
                logger.info(f"Updated real-time price for {coin_id}: {current_price}")
                
        except Exception as e:
            logger.error(f"Error updating real-time price: {str(e)}")
        
        time.sleep(price_update_interval_minutes * 60)

# Start a thread to update data periodically
def start_update_thread():
    while True:
        update_data(default_coin_id)
        time.sleep(update_interval_hours * 3600)

# Start threads for data updates and real-time price updates
update_thread = threading.Thread(target=start_update_thread)
update_thread.start()

real_time_price_thread = threading.Thread(target=update_real_time_prices, args=([default_coin_id],))
real_time_price_thread.start()

# Flask routes
@app.route('/')
def index():
    return "Comunity Node Crypto price prediction model"

# Flask route to predict coin prices
# Flask route to predict coin prices
@app.route('/api/predict/<coin_id>', methods=['GET'])
def predict_coin(coin_id):
    try:
        if not coin_id:
            coin_id = default_coin_id
        
        if coin_id not in predictions or coin_id not in historical_prices:
            update_data(coin_id)
            real_time_price_coin_ids.append(coin_id)  
        
        preds = predictions.get(coin_id, pd.DataFrame(columns=['timestamp', 'predicted_price', 'volatility_factor']))
        df_prices = historical_prices.get(coin_id, pd.DataFrame(columns=['timestamp', 'price', 'momentum_1d', 'breakout']))
        
        df_prices = df_prices[df_prices['timestamp'] >= (datetime.now() - timedelta(days=2))]
        
        predictions_dict = preds.to_dict(orient='records')
        historical_prices_dict = df_prices.to_dict(orient='records')
        
        # Calculate timestamps for plotting
        timestamps = df_prices['timestamp']
        
        # Plotting historical prices and predictions for last 2 days
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(timestamps, df_prices['price'], label='Historical Price')
        ax.plot(preds['timestamp'], preds['predicted_price'], label='Predicted Price')
        ax.set_xlabel('Timestamp')
        ax.set_ylabel('Price')
        ax.set_title(f'Historical and Predicted Prices for {coin_id}')
        ax.legend()

        # Convert plot to base64 for rendering in HTML
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plot_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()

        return render_template('index.html', coin_id=coin_id, predictions=predictions_dict,
                               historical_prices=historical_prices_dict, plot_base64=plot_base64,
                               mae=mae.get(coin_id), mse=mse.get(coin_id), r2=r2.get(coin_id),
                               real_time_prices=real_time_prices.get(coin_id, [])[-10:],
                               volatility_factor=preds['volatility_factor'].iloc[0] if not preds.empty else None,
                               momentum_1d=df_prices['momentum_1d'].iloc[-1] if not df_prices.empty else None,
                               breakout=df_prices['breakout'].iloc[-1] if not df_prices.empty else None)
    
    except Exception as e:
        logger.error(f"Error processing request for coin_id {coin_id}: {str(e)}")
        return f"Error processing request for coin_id {coin_id}: {str(e)}", 500 

    try:
        if not coin_id:
            coin_id = default_coin_id
        
        if coin_id not in predictions or coin_id not in historical_prices:
            update_data(coin_id)
            real_time_price_coin_ids.append(coin_id)  
        
        preds = predictions.get(coin_id, pd.DataFrame(columns=['timestamp', 'predicted_price', 'volatility_factor']))
        df_prices = historical_prices.get(coin_id, pd.DataFrame(columns=['timestamp', 'price', 'momentum_1d', 'breakout']))
        predictions_dict = preds.to_dict(orient='records')
        historical_prices_dict = df_prices.to_dict(orient='records')    
        timestamps = df_prices['timestamp']
        # Plotting historical prices and predictions
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(timestamps, df_prices['price'], label='Historical Price')
        ax.plot(preds['timestamp'], preds['predicted_price'], label='Predicted Price')
        ax.set_xlabel('Timestamp')
        ax.set_ylabel('Price')
        ax.set_title(f'Historical and Predicted Prices for {coin_id}')
        ax.legend()

        # Convert plot to base64 for rendering in HTML
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plot_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()

        return render_template('index.html', coin_id=coin_id, predictions=predictions_dict,
                               historical_prices=historical_prices_dict, plot_base64=plot_base64,
                               mae=mae.get(coin_id), mse=mse.get(coin_id), r2=r2.get(coin_id),
                               real_time_prices=real_time_prices.get(coin_id, [])[-10:],
                               volatility_factor=preds['volatility_factor'].iloc[0] if not preds.empty else None,
                               momentum_1d=df_prices['momentum_1d'].iloc[-1] if not df_prices.empty else None,
                               breakout=df_prices['breakout'].iloc[-1] if not df_prices.empty else None)
    
    except Exception as e:
        logger.error(f"Error processing request for coin_id {coin_id}: {str(e)}")
        return f"Error processing request for coin_id {coin_id}: {str(e)}", 500  # Return error message with HTTP status code

if __name__ == '__main__':
    app.run(debug=True)
