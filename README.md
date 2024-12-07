# California's Informative Beach Website
## Project Overview
California's Informative Beach Website is a cloud-based platform providing updated and accurate information about California beaches. Designed for tourists and residents, the website promotes environmental awareness while offering real-time beach data, including weather, tide conditions, nearby attractions, and safety alerts.

## Features
1. ### Real-Time Data:
    Live updates on weather, tide conditions, and water quality.
2. Personalized Experience:
    Track user preferences, favorites, and alerts.
3. Environmental Awareness:
    Highlights conservation efforts and coastal dangers.
4. Comprehensive Beach Information:
    Local wildlife, nearby points of interest, and more.

## Technology Stack
1. Frontend:
    Developed using React.js for a responsive user interface.
Backend:
Built with Node.js to handle API data processing and user management.
Database:
Google Cloud SQL (MySQL) for storing user preferences and historical data.
Hosting:
Google Compute Engine (GCE) for scalable backend hosting.
Deployment Automation:
Google Deployment Manager for automated resource provisioning and version control.
Monitoring and Logging:
Integrated with Google Cloud Monitoring and Logging for performance tracking.
Deployment Architecture
Frontend:
Hosted on a virtual machine in GCE.
Communicates with the backend using RESTful APIs.
Backend:
Hosted on a separate GCE instance.
Secured connectivity with Cloud SQL using IAM roles.
Database:
Cloud SQL handles user preferences, alerts, and archived data for trend analysis.
Project Goals
Provide a one-stop platform for all beach-related information in California.
Promote user engagement with personalized notifications and conservation updates.
Ensure scalability and reliability with robust cloud infrastructure.
Setup and Usage
Clone the Repository:

bash
Copy code
git clone https://github.com/jainishshah0124/california-beach-website.git
Install Dependencies:

bash
Copy code
cd california-beach-website/frontend
npm install
cd ../backend
npm install
Run the Application:

Frontend:
bash
Copy code
npm start
Backend:
bash
Copy code
node server.js
Access the Website: Visit http://localhost:3000 for the frontend.

API Integration
Weather and tide data fetched from third-party APIs.
Secure API endpoints for user preferences and alerts.
Contributors
Josue Rivas
Wayne Muse
Ali Yassine
Jainish Shah
Andres Perez
Future Enhancements
Add a mobile app version of the platform.
Incorporate more analytics for historical trends.
Expand coverage to include beaches outside California.