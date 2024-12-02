# My Capstone - SparkWise CRM

## Deployed Links
The app is fully deployed and accessible via the following links:

Frontend: https://sparkwise-crm.netlify.app/

Backend: https://sparkwise-crm-backend-ad7664a817c3.herokuapp.com/

## Limitations
**Zoom Link Generation:**
- This app is connected to a pro Zoom account, which is personal to my sister and me. You will be able to generate a zoom link however, you won't be able to see it populate in the Zoom app. However, here is a short video to show you the general flow of the app, as well as, how the zoom link is generated and how the calendar event is made: [https://youtu.be/jZpuAdtxGb8 ](https://youtu.be/Qi3EGENtmFg)

## Key Features of the App
- Calendar View with Google Calendar and Zoom integration:
  - Create, delete, and edit events.
  - You can create recurring events.
  - All attendees must be clients prior to creating a meeting. This prevents us from creating events without having the appropriate client information.
  - Events created in the app are automatically added to my Google Calendar.
  - All attendees receive an email with an invitation to the event.
  - Deleting an event removes it from the Google Calendar and also notifies attendees of the cancellation.
  - You can also generate Zoom meeting links for events.
  - When an event with a Zoom link is deleted, the associated Zoom meeting is also removed automatically.
- Client List: Add, edit, and delete clients.
- Student List: Add, edit, and delete students.

## Recommended Testing Flow
**1. Create a New Client:**
- Navigate to the Clients page.
- Add a new client using the "Add Client" button.
- You can use your personal email when creating the client to see if the meeting invites work properly.

**2. Create a Calendar Event:**
- Navigate to the Calendar page.
- Create a new event and assign it to the client you just created.
- Note: You can use all features here except the "Generate Zoom Link" button.

**3. Student Management:**
- Navigate to the Students page to explore its functionality.
- You can add, edit, and delete student records.





