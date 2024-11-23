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

- Bootstrap: open source css frameworks used to build fast and responsive sites
  - toasts for notifcations
- Refine

### APIs

- Google Calendar API:
  - Used to integrate calendar functionalities, enabling viewing, creating, updating, and deleting events directly within the CRM application.

### Sitemap

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

[Link to Figma design](https://www.figma.com/design/D2wCPghiKi2NqWcCWEFnIF/SparkWise-CRM---BrainStation-Capstone-Proposal?node-id=23-465&node-type=frame&t=KHbWv92fTozRijPK-0)

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

Relationships:

- For simplicity in MVP, there are no direct foreign key relationships.

### Endpoints

**Clients Endpoints**

1. Get All Clients

Method: GET
URL: /clients
Description: Fetch all client records from the database.
Response Example:

[
{
"id": 1,
"parent_first_name": "John",
"parent_last_name": "Doe",
"parent_phone": "123-456-7890",
"parent_email": "john.doe@example.com",
"child_first_name": "Emily",
"child_grade": "4",
"subjects_interested": "Creative Writing",
"city": "Toronto",
"postal_code": "A1B 2C3",
"additional_notes": "Wants to learn how to write creatively",
"status": "Form Filled Out",
"how_did_you_hear": "Online Ad",
"created_at": "2024-11-01T14:30:00Z"
}
]

2. Get Single Client by ID

Method: GET
URL: /clients/:id
Description: Fetches the details of a single client based on the provided ID.
Response Example:

{
"id": 1,
"parent_first_name": "John",
"parent_last_name": "Doe",
"parent_email": "john.doe@example.com",
"parent_phone": "123-456-7890",
"child_first_name": "Emily",
"child_grade": "4",
"subjects_interested": "Creative Writing",
"city": "Toronto",
"postal_code": "A1B 2C3",
"additional_notes": "Wants to learn how to write creatively",
"status": "Form Filled Out",
"how_did_you_hear": "Social Media",
"created_at": "2024-11-01T14:30:00Z"
}

3. Update Client by ID

Method: PUT
URL: /clients/:id
Description: Updates the details of an existing client by ID. All fields must pass validation before updating.
Request Example:
{
"parent_first_name": "John",
"parent_last_name": "Doe",
"parent_phone": "123-456-7890",
"parent_email": "john.doe@example.com",
"child_first_name": "Jane",
"child_grade": "5",
"subjects_interested": "Math, Science",
"city": "Toronto",
"postal_code": "M5V 1A1",
"additional_notes": "Prefers evening classes",
"status": "Trial Lesson Booked",
"how_did_you_hear": "Google"
}

Response Example:
{
"id": 2,
"parent_first_name": "John",
"parent_last_name": "Doe",
"parent_phone": "123-456-7890",
"parent_email": "john.doe@example.com",
"child_first_name": "Jane",
"child_grade": "5",
"subjects_interested": "Math, Science",
"city": "Toronto",
"postal_code": "M5V 1A1",
"additional_notes": "Prefers evening classes",
"status": "Trial Lesson Booked",
"how_did_you_hear": "Google",
"created_at": "2024-11-22T03:31:29.000Z",
"updated_at": "2024-11-22T18:26:41.000Z"
}

4. Create New Client

Method: POST
URL: /clients
Description: Creates a new client record in the database. Mandatory fields include parent and child information, contact details, and subjects of interest.
Request Example:

{
"parent_first_name": "John",
"parent_last_name": "Smith",
"parent_phone": "555-123-4567",
"parent_email": "john.smith@example.com",
"child_first_name": "Alex",
"child_grade": "2",
"subjects_interested": "Reading, Math",
"city": "Montreal",
"postal_code": "H2Y 1C6",
"how_did_you_hear": "Referral"
}
Response Example:
{
"message": "Client has been created successfully."
}

5. Delete Client by ID
   Method: DELETE
   URL: /clients/:id
   Description: Deletes an existing client by ID.
   Response Example:
   Success: Status 204 (No Content)
   Failure:
   { "message": "Client with ID 5 not found" }

**Calendar API Endpoints**

1. Get All Events

Method: GET
URL: /calendar
Description: Retrieve all calendar events to display.
Response Example:
[
{
"kind": "calendar#event",
"etag": "\"3377335321262000\"",
"id": "jqkd6ij88fue2t3qvq62281gto",
"status": "confirmed",
"htmlLink": "....",
"created": "2023-06-30T18:16:30.000Z",
"updated": "2023-07-06T18:21:00.631Z",
"summary": "OuterBox & SparkWise Enrichment",
"description": "Event Name:",
"location": "phone number",
"creator": {
"email": "email@email.com"
},
"organizer": {
"email": "email@email.com"
},
"start": {
"dateTime": "2023-07-06T15:00:00-04:00",
"timeZone": "America/New_York"
},
"end": {
"dateTime": "2023-07-06T15:45:00-04:00",
"timeZone": "America/New_York"
},
"iCalUID": "jqkd6ij88fue2t3qvq62281gto@google.com",
"sequence": 0,
"attendees": [
{
"email": "email@email.com",
"organizer": true,
"responseStatus": "accepted"
},
{
"email": "email@email.com",
"self": true,
"responseStatus": "accepted"
}
],
"guestsCanInviteOthers": false,
"reminders": {
"useDefault": true
},
"eventType": "default"
},.....
]

2. Get Sinlge Event by Id
   Method: GET
   URL: /calendar/event/:id
   Description: Get a single event from a calendar based on ID.
   Response Example:
   {
   "kind": "calendar#event",
   "etag": "\"3464638818626000\"",
   "id": "e705ih0qeq613ga0dt111agn3s",
   "status": "cancelled",
   "htmlLink": "....",
   "created": "2024-11-22T23:49:43.000Z",
   "updated": "2024-11-22T23:50:09.313Z",
   "summary": "Team Meeting",
   "description": "Discuss project progress and next steps",
   "creator": {
   "email": "email@email.com"
   },
   "organizer": {
   "email": "email@email.com",
   "self": true
   },
   "start": {
   "dateTime": "2024-12-01T10:00:00-05:00",
   "timeZone": "UTC"
   },
   "end": {
   "dateTime": "2024-12-01T12:00:00-05:00",
   "timeZone": "UTC"
   },
   "iCalUID": "e705ih0qeq613ga0dt111agn3s@google.com",
   "sequence": 1,
   "reminders": {
   "useDefault": true
   },
   "eventType": "default"
   }

3. Add New Event
   Method: POST
   URL: /calendar
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

4. Update Event
   Method: PUT
   URL: /calendar/event/:id
   Description: Update an existing event in the calendar.
   Body Example:
   {
   "summary": "Team Meeting",
   "description": "Discuss project progress and next steps",
   "start": "2024-12-01T10:00:00-05:00",
   "end": "2024-12-01T11:00:00-06:00"
   }
   Response Example:
   {"message": "Event created successfully"}

5. Delete Event
   Method: DELETE
   URL: /calendar/event/:id
   Description: Remove an event from the calendar.
   Response Example:
   { "message": "Event deleted successfully" }

6. Get todays events (will be used on the dashboard)
   Method: GET
   URL: /calendar/today
   Description: Get all events from the calendar for todays date.
   Response Example:
   [
   {
   "kind": "calendar#event",
   "etag": "\"3464068087832000\"",
   "id": "mfpb7e9d3hfage27v4ed0js2s8_20241122T110000Z",
   "status": "confirmed",
   "htmlLink": "....",
   "created": "2024-11-08T15:17:38.000Z",
   "updated": "2024-11-19T16:34:03.916Z",
   "summary": "Creative Writing Private Lesson",
   "description": "...",
   "creator": {
   "email": "sparkwiseenrichment@gmail.com",
   "self": true
   },
   "organizer": {
   "email": "sparkwiseenrichment@gmail.com",
   "self": true
   },
   "start": {
   "dateTime": "2024-11-22T06:00:00-05:00",
   "timeZone": "America/Toronto"
   },
   "end": {
   "dateTime": "2024-11-22T07:00:00-05:00",
   "timeZone": "America/Toronto"
   },
   "recurringEventId": "mfpb7e9d3hfage27v4ed0js2s8",
   "originalStartTime": {
   "dateTime": "2024-11-22T06:00:00-05:00",
   "timeZone": "America/Toronto"
   },
   "iCalUID": "mfpb7e9d3hfage27v4ed0js2s8@google.com",
   "sequence": 1,
   "reminders": {
   "useDefault": true
   },
   "eventType": "default"
   }
   ]

7. Get range of events (only needs query params of start and end)
   Method: GET
   URL: /calendar/range?start=2024-12-01T11:00:00-05:00&end=2024-12-10T11:00:00-05:00&limit=20
   Description: Get all events from the calendar for todays date.
   Response Example:

## Roadmap

Day 1-2: Backend Setup

- Configure the MySQL database schema:
  - Create tables for Clients and Calendar.
- Set up and test basic CRUD endpoints for Clients and Calendar
- Set up basic integration with the Google Calendar API

Day 3-4: Frontend Setup and Client List Page

- Set up the React frontend environment.
- Build the Client List Page:
  - Fetch and display clients using GET /api/clients.
  - Add a form (modal) for adding new clients (POST /api/clients).
  - Implement status updates using PATCH /api/clients/:id.

Day 4-5: Calendar Page

- Build the Calendar Page
- Use FullCalendar to display the monthly calendar.
- Implement modals for adding or editing events

Day 6-7: Finalizing and Deployment

- Perform end-to-end testing:
  - Verify all endpoints work as expected with frontend interactions.
  - Debug and resolve UI or backend issues.
  - Polish the UI for usability and presentation.
- Review and finalize all features.
- Deploy the app.
- Prepare a demo and slideshow showcasing the Client List and Class Schedule pages.

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
