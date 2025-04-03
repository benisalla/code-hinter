from flask import Blueprint, jsonify, request
from llm.mistral import query
from llm.smol.smol_func import evaluate_code, compare_code
from crud.exercise_crud import get_exercise_by_id
from crud.stud_exe_crud import create_stud_exe
smol_api = Blueprint('smol_api', __name__, url_prefix='/api')

@smol_api.route('/evaluate_code', methods=['POST'])
def evaluate_code_api():
    data = request.json

    if not data or not data.get("concepts") or not data.get("code"):
        return jsonify({"error": "Both 'concepts', and 'code' are required."}), 400

    try:
        response = evaluate_code(
            concepts=data.get("concepts"),
            st_code=data.get("code"),
            temperature=0.9,
            max_new_tokens=1024,
        )
    
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@smol_api.route('/compare_code', methods=['POST'])
def compare_code_api():
    data = request.json
    if not data or not data.get("code_prof") or not data.get("code_student"):
        print({"error": "Both 'code_prof', and 'code_student' are required."})
        return jsonify({"error": "Both 'code_prof', and 'code_student' are required."}), 400
    
 
    try:
        response = compare_code(
            pr_code=data.get("code_prof"),
            st_code=data.get("code_student"),
            temperature=0.6,
            max_new_tokens=200
        )
        
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@smol_api.route('/test/', methods=['GET'])
def test_query():
    prompt = (
        "<s>Deep learning is a subfield of machine learning focused on neural networks.</s>\n"
        "[INST] Explain in simple terms. [/INST]"
    )
    try:
        output = query({
            "inputs": prompt,
            "parameters": {
                "temperature": 1,
                "max_length": 1024,
                "top_p": 0.9,
                "top_k": 50,
                "repetition_penalty": 1.1
            }
        })
        return jsonify({"response": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
