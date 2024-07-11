# Cryptocurrency Price Prediction Model Learning

## Overview
This Flask application predicts cryptocurrency prices using historical data and updates predictions in real-time. It leverages machine learning models, specifically Linear Regression, to forecast future prices based on past trends.

## Features
- **Historical Data Analysis:**
  - Fetches and analyzes historical price data from CoinGecko API.
  - Calculates metrics like Mean Absolute Error (MAE), Mean Squared Error (MSE), and R-squared (R²) score.
  - Implements K-fold cross-validation for model evaluation.

- **Real-Time Price Updates:**
  - Continuously updates real-time prices using the CoinGecko API every specified interval.

- **Visualization:**
  - Generates plots showing historical prices and predicted prices for visualization in the web interface.
  - Uses Matplotlib to create dynamic charts embedded in HTML using base64 encoding.

- **Additional Metrics:**
  - Calculates additional metrics such as momentum and breakout to provide insights into price trends.

- **Deployment:**
  - Flask web application deployed locally for development purposes.

## Technologies Used
- **Python Libraries:**
  - Flask: Web framework for developing the application.
  - pandas: Data manipulation and analysis.
  - scikit-learn: Machine learning library for model training and evaluation.
  - requests: HTTP library for API requests.
  - matplotlib: Plotting library for visualizations.
  - base64: Encoding binary data for embedding plots in HTML.

## Functionality Breakdown

### `fetch_historical_prices(coin_id, vs_currency, days)`
- **Purpose:** Retrieves historical price data for a specified cryptocurrency.
- **Parameters:**
  - `coin_id`: Cryptocurrency ID (e.g., 'bitcoin', 'ethereum').
  - `vs_currency`: Currency to convert prices into (e.g., 'usd').
  - `days`: Number of days of historical data to fetch.
- **Returns:** JSON response containing historical price data.

### `calculate_momentum_and_breakout(df_prices)`
- **Purpose:** Computes additional metrics like momentum and breakout based on historical price data.
- **Parameters:**
  - `df_prices`: DataFrame containing historical price data.
- **Returns:** DataFrame with added columns for momentum and breakout indicators.

### `update_data(coin_id)`
- **Purpose:** Updates historical and predicted price data for a specified cryptocurrency.
- **Parameters:**
  - `coin_id`: Cryptocurrency ID to update data for.
- **Process:**
  - Fetches historical prices using `fetch_historical_prices`.
  - Trains a Linear Regression model on historical data.
  - Predicts future prices and calculates additional metrics.
  - Stores results in global variables (`predictions`, `historical_prices`, `mae`, `mse`, `r2`).

### `update_real_time_prices(coin_ids)`
- **Purpose:** Continuously updates real-time prices for specified cryptocurrencies.
- **Parameters:**
  - `coin_ids`: List of cryptocurrency IDs to monitor.
- **Process:**
  - Periodically fetches current prices from the CoinGecko API.
  - Stores recent prices in `real_time_prices` dictionary.

### Flask Routes
  - **`/api/predict/<coin_id>`:** Retrieves predicted and historical prices, metrics, and real-time updates for a specified cryptocurrency.
  - Renders HTML template (`index.html`) with data for visualization.

## Formulas

### Linear Regression Formula for Price Prediction
The application uses Linear Regression to predict future cryptocurrency prices. The formula for predicting price \( \hat{y} \) based on features \( X \) (timestamps) is:
y_hat = β_0 + β_1 * X
Where:
- β_0 (beta zero) is the intercept.
- β_1 (beta one) is the coefficient for the timestamp feature.

### Momentum Formula
Momentum is calculated as the difference in prices over a specified period (e.g., 1 hour):
Momentum = Price_t - Price_{t-1}
### Breakout Formula
Breakout indicates significant price movements beyond a specified threshold (e.g., 5%):
break out = if absolute value of (Price_t - Price_{t-1}) divided by Price_{t-1} is greater than 0.05:
Breakout = 1
else:
Breakout = 0
This format defines Breakout as a condition that evaluates whether the absolute percentage change between two consecutive prices exceeds a specified threshold, indicating a significant price movement.

### R-squared (R²) Score Formula
R-squared (R²) score measures the proportion of the variance in the dependent variable (price) that is predictable from the independent variable (timestamps):
R^2 = 1 - (sum of squared residuals) / (total sum of squares)
Where:
- y is the observed values.
- y_hat is the predicted values.
- y_bar is the mean of the observed values y.

## Example Usage
1. **Start Application:**
   - Run `python server.py` to start the Flask application.

2. **Predict Prices:**
   - Visit `http://localhost:5000/api/predict/bitcoin` to see predictions for Bitcoin.
   - Replace `bitcoin` with other cryptocurrency IDs (e.g., `ethereum`, `solana`) for different predictions.

## Resources for Further Reading
- **Linear Regression:**
  - [Scikit-learn Documentation on Linear Regression](https://scikit-learn.org/stable/modules/linear_model.html)
- **K-fold Cross-Validation:**
  - [Cross-validation techniques in scikit-learn](https://scikit-learn.org/stable/modules/cross_validation.html)
- **Momentum and Breakout Strategies:**
  - [Investopedia on Momentum Trading](https://www.investopedia.com/terms/m/momentum_investing.asp)
  - [Breakout Trading Strategies](https://www.investopedia.com/trading/breakout-trading-strategies/)
- **Coin Gecko:**
  - [Coin Gecko](https://www.coingecko.com/)
- ##Try ours web page
  - [Bitcoin](https://priceprediction.comunitynode.my.id/api/predict/bitcoin)





