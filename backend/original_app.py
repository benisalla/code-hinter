# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from llm.constant import PROMPT
# from llm.mistral import query
# from backend.llm.smol.smol import SmolLM
# import torch

# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# app = Flask(__name__)
# smol = SmolLM()
# CORS(app)


# # @app.route('/api/query_mistral', methods=['POST'])
# # def handle_query():
# #     data = request.json
# #     concepts = data.get("concepts", "")
# #     st_code = data.get("st_code", "")

# #     # Validate inputs
# #     if not concepts or not st_code:
# #         return jsonify({"error": "prof_hints, stud_code, and model_instr are required"}), 400

# #     # prompt
# #     prompt = PROMPT.format(concepts=concepts, code=st_code)
# #     try:
# #         # Query the Hugging Face API
# #         output = query({
# #             "inputs": prompt,
# #             "parameters": {
# #                 "temperature": 0.9,
# #                 "max_length": 2048,
# #                 "top_p": 0.9,
# #                 "top_k": 30,
# #                 "repetition_penalty": 1.1
# #             }
# #         })
# #         response = output[0]["generated_text"].split("[/INST]")[1].strip()
# #         return jsonify({"response": response})
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# @app.route("/api/evaluate_code", methods=["POST"])
# def evaluate_code():
#     print("-----------------------------")
#     print("evaluate code is triggered ")
#     print("-----------------------------")

#     data = request.json
#     if not data or not data.get("concepts") or not data.get("st_code"):
#         return jsonify({"error": "Concepts and code are required."}), 400
    
#     # model_type = data.get("model_type")

#     try:
#         response = smol.evaluate_code(
#             concepts=data["concepts"],
#             code=data["st_code"],
#             temperature=1.0,
#             max_new_tokens=500,
#         )
#         print("------------------------------")
#         print(f"response is : {response}")
#         return jsonify({"response": response}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    
    
# @app.route("/api/compare_code", methods=["POST"])
# def compare_code():
#     data = request.json
#     if not data or 'pr_code' not in data or 'st_code' not in data:
#         return jsonify({"error": "Both 'professor_code' and 'student_code' are required."}), 400

#     try:
#         response = smol.compare_code(
#             pr_code=data["pr_code"],
#             st_code=data["st_code"],
#             temperature=0.6, 
#             max_new_tokens=200
#         )
#         return jsonify({"response": response}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500




# ###############################################
# #####       this just for testing         #####
# ###############################################
# @app.route('/api/test/', methods=['GET'])
# def test_query():
#     prompt = "<s>Deep learning is a subfield of machine learning focused on neural networks.</s>\n[INST] Explain in simple terms. [/INST]"
#     try:
#         output = query({
#             "inputs": prompt,
#             "parameters": {
#                 "temperature": 1,
#                 "max_length": 1024,
#                 "top_p": 0.9,
#                 "top_k": 50,
#                 "repetition_penalty": 1.1
#             }
#         })
#         return jsonify({"response": output})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# if __name__ == '__main__':
#     app.run(debug=True)
