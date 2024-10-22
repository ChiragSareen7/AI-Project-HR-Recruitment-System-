import PyPDF2
import os
from groq import Groq

pdf_path = 'keec1gl.pdf'
pdf_reader = PyPDF2.PdfReader(pdf_path)

text = ""
for i in range(1, 3):  
    text += pdf_reader.pages[i].extract_text()

with open("text.txt", "w", encoding='utf-8') as f:
    f.write(text)

question = input("Please enter your question based on the extracted text: ")

api_key = "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"

client = Groq(
    api_key=api_key,
)

prompt = f"Context: {text}\n\n{question}"

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": prompt,
        }
    ],
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)
