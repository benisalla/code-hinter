import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from llm.constant import MODEL_CHECKPOINT, CLIENT_PROMPT, SYS_PROMPT, SYS_COMPARE_PROMPT, COMPARE_PROMPT

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class SmolLM:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)
        self.model = AutoModelForCausalLM.from_pretrained(MODEL_CHECKPOINT).to(DEVICE)

    def apply_chat_template(self, sys_prompt, user_prompt):
        messages = [
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": user_prompt}
        ]
        return self.tokenizer.apply_chat_template(messages, tokenize=False)

    def evaluate_code(self, concepts, code, temperature=0.9, max_new_tokens=200, top_p=0.9, do_sample=True):
        # Prepare the user prompt
        user_prompt = CLIENT_PROMPT.format(concepts=concepts, code=code)

        # Prepare input using chat template
        in_text = self.apply_chat_template(SYS_PROMPT, user_prompt)
        inputs = self.tokenizer.encode(in_text, return_tensors="pt").to(DEVICE)

        # Generate response
        outputs = self.model.generate(
            inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=do_sample,
        )

        str_output = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

        output =str_output.split("\nassistant")[-1].strip()

        return output
    
    def compare_code(self, pr_code, st_code, temperature=0.5, max_new_tokens=200, top_p=0.9, do_sample=True):
        # Prepare the user prompt
        user_prompt = COMPARE_PROMPT.format(pr_code=pr_code, st_code=st_code)

        # Prepare input using chat template
        in_text = self.apply_chat_template(SYS_COMPARE_PROMPT, user_prompt)
        inputs = self.tokenizer.encode(in_text, return_tensors="pt").to(DEVICE)

        # Generate response
        outputs = self.model.generate(
            inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=do_sample,
        )

        # Decode and return the response
        result = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        result = result.split("\nassistant\n")[-1]
        try:
            score = int(result)
            if score < 0:
              score = 0
            if score > 100:
              score = 100
        except ValueError:
            print("Invalid score format:", result)
            score = 0

        return score