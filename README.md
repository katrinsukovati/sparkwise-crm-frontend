# SparkWise Enrichment Programs CRM

## Overview

A custom CRM (Customer Relationship Management) application designed to manage our online enrichment programs for students in grades 1-8. This app simplifies lead tracking and scheduling, replacing a messy and cumbersome Google Sheets workflow. It’s tailored to our specific needs, avoiding the limitations and high costs of existing CRMs.

### Problem Space

Managing clients, leads, and class schedules through Google Sheets has become inefficient and error-prone as our business scales. Existing CRM solutions are either too expensive or fail to meet our specific needs without costly customization. A dedicated CRM will streamline our operations, save time, and improve accuracy.

### User Profile

- Primary Users: Business owners (my sister and I), admins, and assistants.
- Use Cases for Primary Users:
  - Track leads through different stages (e.g., contacted, demo lesson booked).
  - Quickly access and update client details.
  - Manage class schedules

### Features

Client List

- Lead Management
- Add new leads manually and automatically from filled out forms on website (website exists already).
- View a list of all leads with basic details (name, email, phone, status).
- Update lead status (e.g., form filled out, not a fit/not interested, contacted/called/sent email, trial lesson booked, trial lesson completed, invoice sent, paid/enrolled) using a label (different colors).
- Ability to search clients.

Calendar/Class Schedules:

- View and edit class schedules for each term. Have a drag and drop feature to move classes around.

## Implementation

### Tech Stack

MySQL, Express, React, Node

- Will use Webhooks to notify app when a new lead is added in real time without needing to refresh

Libraries that may be helpful:

- React Modal
- React Hook Form (for forms)
- FullCalendar (for calendar and scheduling)
- For drag and drop features in the calendar: pragmatic drag and drop, dnd kit

Frameworks:

- Bootstrap (toast for notifcations)

### APIs

List any external sources of data that will be used in your app.

- No external APIs will be used. The application will rely on its own server and database.

### Sitemap

List the pages of your app with brief descriptions. You can show this visually, or write it out.

Page 1: Client List Page (Manage leads)

- Sections:
  - Lead Management Table:
    - Display list of all leads with key details (name, email, phone, status).
    - Status update functionality (color-coded labels for statuses).
    - Add New Client/Edit Client:
      - Modal triggered by a button.
  - Search bar to filter clients.

Page 2: Class Schedules Page (Manage class schedules)

- Sections:
  - Daily/Weekly/Monthly Calendar View (for MVP, I will only do a monthly view)
    - Display classes as draggable blocks.
    - Manually add events

### Mockups

Provide visuals of your app's screens. You can use pictures of hand-drawn sketches, or wireframing tools like Figma.

### Data

- Clients Table

  - Columns:
    - id (Primary Key, Auto-increment)
    - parents first name (String)
    - parents last name (String)
    - email (String)
    - phone (String)
    - childs first name (String)
    - childs grade (Integer)
    - additional notes (string)
    - status (String) – e.g., "Form Filled Out," "Contacted," "Trial Lesson Booked"
    - created_at (Datetime)

- Calendar Table
  - Columns:
    - id (Primary Key, Auto-increment)
    - name (String) – Class title
    - date (Datetime)
    - time (Datetime)
    - google_event_id (String, Nullable) – For syncing with Google Calendar

Relationships:

- For simplicity in MVP, there are no direct foreign key relationships.

### Endpoints

**Clients Endpoints**

1. Get All Clients:

Method: GET
URL: /api/clients
Description: Fetch all client records from the database.
Response Example:

[
{
"id": 1,
"parents_first_name": "John",
"parents_last_name": "Doe",
"email": "john.doe@example.com",
"phone": "123-456-7890",
"childs_first_name": "Emily",
"childs_grade": 4,
"additional_notes": "wants to learn how to write creatively",
"status": "Form Filled Out",
"created_at": "2024-11-01T14:30:00Z"
}
]

2. Add New Client:

Method: POST
URL: /api/clients

Body Example:
{
"parents_first_name": "John",
"parents_last_name": "Doe",
"email": "john.doe@example.com",
"phone": "123-456-7890",
"childs_first_name": "Emily",
"childs_grade": 4,
"additional_notes": "wants scratch coding",
"status": "Form Filled Out"
}

Response Example:
{ "message": "Client added successfully", "id": 1 }

3. Update Client

Method: PUT
URL: /api/clients/:id
Description: Update multiple fields for a specific client.
Body Example:
{
"parents_first_name": "Jane",
"parents_last_name": "Smith",
"email": "jane.smith@example.com",
"phone": "987-654-3210",
"childs_first_name": "Ethan",
"childs_grade": 5,
"additional_notes": "wants to learn how to write creatively"
}
Response Example:
{ "message": "Client updated successfully" }

4. Update Client Status (drop down)

Method: PATCH
URL: /api/clients/:id/status
Body Example:
{ "status": "Trial Lesson Booked" }
Response Example:
{ "message": "Client status updated successfully" }

5. Delete Client

Method: DELETE
URL: /api/clients/:id
Description: Remove a client from the database.
Response Example:
{ "message": "Client deleted successfully" }

**Calendar API Endpoints**

1. Get All Events

Method: GET
URL: /api/calendar
Description: Retrieve all calendar events to display.
Response Example:
[
{
"id": 1,
"name": "Math Class",
"date": "2024-11-19",
"time": "10:00:00",
"google_event_id": null
},
{
"id": 2,
"name": "Science Class",
"date": "2024-11-20",
"time": "14:00:00",
"google_event_id": "abc123"
}
]

2. Add New Event
   Method: POST
   URL: /api/calendar
   Description: Create a new event in the calendar.
   Body Example:
   {
   "name": "Math Class",
   "date": "2024-11-19",
   "time": "10:00:00",
   "google_event_id": null
   }
   Response Example:
   { "message": "Event added successfully", "id": 1 }

3. Update Event
   Method: PUT
   URL: /api/calendar/:id
   Description: Update an existing event in the calendar.
   Body Example:
   {
   "name": "Math Class (Updated)",
   "date": "2024-11-19",
   "time": "11:00:00"
   }
   Response Example:
   { "message": "Event updated successfully" }

4. Delete Event
   Method: DELETE
   URL: /api/calendar/:id
   Description: Remove an event from the calendar.
   Response Example:
   { "message": "Event deleted successfully" }

## Roadmap

Day 1-2: Backend Setup

- Configure the MySQL database schema:
- Create tables for Clients and Calendar.

  - Set up and test basic CRUD endpoints for:
  - GET /api/clients, POST /api/clients, PATCH /api/clients/:id, DELETE /api/clients/:id.
  - GET /api/calendar, POST /api/calendar, PATCH /api/calendar/:id, DELETE /api/calendar/:id.

- Day 3: Frontend Setup and Client List Page
- Set up the React frontend environment.
- Build the Client List Page:
  - Fetch and display clients using GET /api/clients.
  - Add a form (modal) for adding new clients (POST /api/clients).
  - Implement status updates using PATCH /api/clients/:id.

Day 4: Class Schedule Page

- Build the Class Schedule Page:
- Use FullCalendar to display the monthly calendar.
- Fetch events using GET /api/calendar and display them in the calendar.
- Implement modals for adding or editing events:
  - Use POST /api/calendar and PATCH /api/calendar/:id.

Day 5-6: Google Calendar Integration

- Set up basic integration with the Google Calendar API

Day 7: Finalizing and Deployment

- Perform end-to-end testing:
  - Verify all endpoints work as expected with frontend interactions.
  - Debug and resolve UI or backend issues.
  - Polish the UI for usability and presentation.
- Review and finalize all features.
- Deploy the app.
- Prepare a demo showcasing the Client List and Class Schedule pages.

---

## Future Implementations

- Dashboard:

  - Overview of leads and some useful stats
  - Upcoming classes for that current day
  - Mini todo list

- Class Lists and Student Management:

  - Maintain a list of enrolled students based on the selected class.
  - Assign enrolled students to classes.
  - Track student attendance.

- Teacher Management:

  - List of teachers with their assigned classes and schedules.
  - Contact information and availability tracking.

- Authentication

  - Google OAuth

- For the client list:

  - Add pagination

- For the calendar view:

  - Connect calendar to Google calendar
  - Each class block would be clickable and include details about students enrolled, their emails, and teacher assigned to that class.

- Invoice generation:
  - Would automatically create and send off invoices to clients