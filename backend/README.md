# RAG Search Engine Web Application

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd genai-webapp-backend
   ```

2. **Install Poetry:**

   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

3. **Install Python dependencies using Poetry:**

   ```bash
   poetry install
   ```

4. **Set up environment variables by creating a `.env` file:**

   ```env
   MONGODB_URI=mongodb://localhost:27017/rag_search
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
   ```

5. **Start the FastAPI server using LangChain serve:**

   ```bash
   langchain serve --port 8101
   ```

   The backend API will be available at `http://localhost:8101`

### Google Cloud Setup

1. **Create a Google Cloud project and enable VertexAI API**
2. **Create a service account and download the credentials JSON file**
3. **Set the path to your credentials in the backend `.env` file**

### MongoDB Setup

1. **Install MongoDB Community Edition**
2. **Start the MongoDB service**
3. **Create a new database named 'rag_search'**

## API Documentation

Once the backend is running, visit `http://localhost:8101/docs` for the complete API documentation.

## Development

- Frontend code is in the `genai-webapp-frontend` directory
- Backend code is in the `genai-webapp-backend` directory
- Components use shadcn/ui library
- Styling is done with Tailwind CSS

## Available Scripts

**Frontend:**

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

**Backend:**

```bash
langchain serve --port 8101    # Start development server
pytest                         # Run tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
