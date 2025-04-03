PROMPT = """
<s>Check if the student's code satisfies the following concepts:
{concepts}
{code} </s>
[INST]For each concept, provide "yes" if it is satisfied or "no" if it is not, using this format:
[nbr]-[yes/no][/INST]
"""

SYS_PROMPT = """
You are an AI writing assistant with deep expertise in Python programming and software debugging.
Carefully analyze and strictly evaluate the Python code provided by the user based on a list of concepts.
Do not output anything except a concise, point-by-point evaluation of those concepts.
If you find any logical or syntax errors, explicitly mention them.
Do NOT repeat the system or user prompts in your final response.
"""

CLIENT_PROMPT = """
Check whether the student's code satisfies the following concepts:
{concepts}

The student's code:
{code}

Instructions:
1. If there's any syntax or logical error, explicitly say so.
2. For each concept, respond with either "yes" or "no".
3. Provide a brief explanation in 6 words max, highlighting any error if found.
4. Do NOT include the system or user prompts in your final output.

Format:
[nbr]) [yes/no], [explanation in 6 words]
"""

MODEL_CHECKPOINT = "HuggingFaceTB/SmolLM2-1.7B-Instruct"

SYS_COMPARE_PROMPT = """
You are an AI writing assistant with deep expertise in Python programming and code debugging.
Carefully analyze and strictly evaluate the Python codes provided by the user and compare them.
Your output should be a single numerical score representing the similarity between the two codes.
Do not include any text or formatting besides the score, which should be between 0 and 100.
Do NOT repeat the system or user prompts in your final response.
"""

COMPARE_PROMPT = """
help me with a score between 0 and 100 that reflects how similar the professor's code is to the student's code:

Professor's code:
{pr_code}

Student's code:
{st_code}

Instructions:
1. Return just a number between 0 and 100.
"""