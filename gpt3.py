import openai
openai.api_key = "sk-get-one"

# This is just pseudo code

with open('question.txt', 'r') as file:
    data = file.read()

completions = openai.Completion.create(
  engine="davinci",
  prompt=data,
  temperature=0.8,
  max_tokens=852,
  stop="====="
)

print(completions)
