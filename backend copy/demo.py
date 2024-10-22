import PyPDF2
import tkinter as tk
from tkinter import filedialog
from dotenv import load_dotenv
import os
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Function to select a PDF file
def select_pdf_file():
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(title="Select a PDF File", filetypes=[("PDF Files", "*.pdf")])
    return file_path

# Function to extract text from the PDF file within a page range
def extract_text_from_pdf(file_path, start_page, end_page):
    text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(file_path)
        for i in range(start_page - 1, end_page):  # Extract text between given page range
            text += pdf_reader.pages[i].extract_text()
    except Exception as e:
        print(f"Error reading PDF file: {e}")
    return text

# Main execution
def main():
    # Let the user select a file
    pdf_path = select_pdf_file()

    if not pdf_path:
        print("No file selected.")
        return

    # Define the page range for text extraction
    start_page = 1
    end_page = 6

    # Extract text from specified pages
    text = extract_text_from_pdf(pdf_path, start_page, end_page)

    if not text.strip():
        print("No text extracted from the PDF file.")
        return

    # Prompt user for a question based on the extracted text
    question = input("Please enter your question based on the extracted text: ")

    # Retrieve the Groq API key from the environment variable
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        print("API key not found. Please make sure it's set in the .env file.")
        return

    # Initialize Groq API client
    client = Groq(api_key=api_key)

    # Prepare the AI prompt
    prompt = f"Context: {text}\n\n{question}"

    # Get AI response from Groq
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama3-8b-8192",
        )
        # Print AI response
        print("AI Response:")
        print(chat_completion.choices[0].message.content)
    except Exception as e:
        print(f"Error with AI response: {e}")

if __name__ == "__main__":
    main()
