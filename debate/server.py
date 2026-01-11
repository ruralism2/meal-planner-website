import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app) # Enable CORS for all origins

# Configure Google Generative AI
# It's highly recommended to use environment variables for API keys
# For demonstration purposes, I'll show how to set it, but user should use an env var
# genai.configure(api_key=os.environ.get("GEMINI_API_KEY")) 
# TODO: User needs to set GEMINI_API_KEY as an environment variable or replace this line.

@app.route('/')
def hello_world():
    return 'Hello, Flask Backend for Meal Planner!'

@app.route('/generate-plan', methods=['POST'])
def generate_meal_plan():
    # Placeholder for receiving ingredients from the frontend
    data = request.json
    ingredients = data.get('ingredients', [])

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    # TODO: Implement the AI prompt engineering and call to Gemini API here
    # For now, return a dummy response
    dummy_meal_plan = {
        "Monday": {
            "Breakfast": ["Dummy Cereal", "Dummy Toast", "Dummy Eggs", "Dummy Fruit", "Dummy Yogurt"],
            "Lunch": ["Dummy Sandwich", "Dummy Salad", "Dummy Soup", "Dummy Pasta", "Dummy Wrap"],
            "Dinner": ["Dummy Chicken", "Dummy Fish", "Dummy Beef", "Dummy Veggies", "Dummy Rice"]
        },
        "Tuesday": {
            "Breakfast": ["Dummy Pancakes", "Dummy Oatmeal", "Dummy Smoothie", "Dummy Bagel", "Dummy Scramble"],
            "Lunch": ["Dummy Pizza", "Dummy Burger", "Dummy Tacos", "Dummy Ramen", "Dummy Curry"],
            "Dinner": ["Dummy Steak", "Dummy Kebab", "Dummy Stir-fry", "Dummy Lentils", "Dummy Quinoa"]
        }
        # ... extend for other days
    }
    
    return jsonify(dummy_meal_plan)

if __name__ == '__main__':
    # For development, run with debug=True
    # In production, use a production-ready WSGI server like Gunicorn or uWSGI
    app.run(debug=True, port=5000)
