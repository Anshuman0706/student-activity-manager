#include "event.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <ctime>
#include <limits>

using namespace std;

struct Event
{
    int id;
    string name;
    string date;
    string venue;
    string description;

    int registeredRolls[100];
    int registrationCount;
};

Event events[200];
int eventCount = 0;

const char *EVENT_FILE = "data/events.txt";

// Get today's date in YYYY-MM-DD format
string getTodayDate()
{
    time_t now = time(0);
    tm *current = localtime(&now);

    char date[11];

    strftime(date, sizeof(date), "%Y-%m-%d", current);

    return string(date);
}

// Load events from file
void loadEvents()
{
    eventCount = 0;

    ifstream file(EVENT_FILE);
    string line;

    while (getline(file, line) && eventCount < 200)
    {
        stringstream ss(line);

        string id, name, date, venue, description, registrations;

        if (getline(ss, id, '|') &&
            getline(ss, name, '|') &&
            getline(ss, date, '|') &&
            getline(ss, venue, '|') &&
            getline(ss, description, '|') &&
            getline(ss, registrations))
        {
            try
            {
                Event e;

                e.id = stoi(id);
                e.name = name;
                e.date = date;
                e.venue = venue;
                e.description = description;
                e.registrationCount = 0;

                stringstream rs(registrations);
                string roll;

                while (getline(rs, roll, ',') &&
                       e.registrationCount < 100)
                {
                    if (!roll.empty())
                    {
                        e.registeredRolls[e.registrationCount++] =
                            stoi(roll);
                    }
                }

                events[eventCount++] = e;
            }
            catch (...)
            {
                // Ignore invalid records
            }
        }
    }
}

// Save events and registrations
void saveEvents()
{
    ofstream file(EVENT_FILE);

    if (!file)
    {
        cout << "Unable to save events.\n";
        cout << "Make sure the data folder exists.\n";
        return;
    }

    for (int i = 0; i < eventCount; i++)
    {
        file << events[i].id << "|"
             << events[i].name << "|"
             << events[i].date << "|"
             << events[i].venue << "|"
             << events[i].description << "|";

        for (int j = 0; j < events[i].registrationCount; j++)
        {
            if (j > 0)
                file << ",";

            file << events[i].registeredRolls[j];
        }

        file << "\n";
    }
}

// Find an event by ID
int findEvent(int id)
{
    for (int i = 0; i < eventCount; i++)
    {
        if (events[i].id == id)
            return i;
    }

    return -1;
}

// Check if text can safely be stored in our file format
bool validField(string value)
{
    return !value.empty() &&
           value.find('|') == string::npos &&
           value.find('\n') == string::npos &&
           value.find('\r') == string::npos;
}

// Add a new event
void addEvent()
{
    if (eventCount >= 200)
    {
        cout << "Event storage is full.\n";
        return;
    }

    Event e;

    int maxId = 0;

    for (int i = 0; i < eventCount; i++)
    {
        if (events[i].id > maxId)
            maxId = events[i].id;
    }

    e.id = maxId + 1;
    e.registrationCount = 0;

    cout << "Enter event name: ";
    getline(cin, e.name);

    cout << "Enter event date (YYYY-MM-DD): ";
    getline(cin, e.date);

    cout << "Enter venue: ";
    getline(cin, e.venue);

    cout << "Enter event description: ";
    getline(cin, e.description);

    if (!validField(e.name) ||
        !validField(e.date) ||
        !validField(e.venue) ||
        !validField(e.description))
    {
        cout << "Fields cannot be empty or contain '|'.\n";
        return;
    }

    // Basic date-format validation
    if (e.date.length() != 10 ||
        e.date[4] != '-' ||
        e.date[7] != '-')
    {
        cout << "Please use the date format YYYY-MM-DD.\n";
        return;
    }

    for (int i = 0; i < 10; i++)
    {
        if (i == 4 || i == 7)
            continue;

        if (e.date[i] < '0' || e.date[i] > '9')
        {
            cout << "Invalid date format.\n";
            return;
        }
    }

    events[eventCount++] = e;
    saveEvents();

    cout << "Event added successfully. Event ID: "
         << e.id << "\n";
}

// Display one event
void displayOneEvent(int index, int currentRollNo)
{
    Event e = events[index];

    cout << "\nEvent ID: " << e.id;
    cout << "\nName: " << e.name;
    cout << "\nDate: " << e.date;
    cout << "\nVenue: " << e.venue;
    cout << "\nDescription: " << e.description;

    bool registered = false;

    for (int j = 0; j < e.registrationCount; j++)
    {
        if (e.registeredRolls[j] == currentRollNo)
        {
            registered = true;
            break;
        }
    }

    cout << "\nYour registration: "
         << (registered ? "Registered" : "Not registered");

    cout << "\n-----------------------------\n";
}

// Display all events
void displayEvents(int currentRollNo)
{
    if (eventCount == 0)
    {
        cout << "No events available.\n";
        return;
    }

    for (int i = 0; i < eventCount; i++)
    {
        displayOneEvent(i, currentRollNo);
    }
}

// Display events scheduled for today or later
void displayUpcomingEvents(int currentRollNo)
{
    string today = getTodayDate();
    bool found = false;

    cout << "\nToday's date: " << today << "\n";

    for (int i = 0; i < eventCount; i++)
    {
        if (events[i].date >= today)
        {
            displayOneEvent(i, currentRollNo);
            found = true;
        }
    }

    if (!found)
        cout << "No upcoming events found.\n";
}

// Search events by name
void searchEvent(int currentRollNo)
{
    string name;
    bool found = false;

    cout << "Enter event name to search: ";
    getline(cin, name);

    for (int i = 0; i < eventCount; i++)
    {
        if (events[i].name.find(name) != string::npos)
        {
            displayOneEvent(i, currentRollNo);
            found = true;
        }
    }

    if (!found)
        cout << "No matching event found.\n";
}

// Register the logged-in student
void registerEvent(int currentRollNo)
{
    int id;

    cout << "Enter event ID to register: ";

    if (!(cin >> id))
    {
        cout << "Invalid event ID.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    int index = findEvent(id);

    if (index == -1)
    {
        cout << "Event not found.\n";
        return;
    }

    if (events[index].date < getTodayDate())
    {
        cout << "Registration unavailable: this event has passed.\n";
        return;
    }

    for (int i = 0; i < events[index].registrationCount; i++)
    {
        if (events[index].registeredRolls[i] == currentRollNo)
        {
            cout << "You are already registered for this event.\n";
            return;
        }
    }

    if (events[index].registrationCount >= 100)
    {
        cout << "Registration limit reached for this event.\n";
        return;
    }

    events[index].registeredRolls[
        events[index].registrationCount++
    ] = currentRollNo;

    saveEvents();

    cout << "Registration successful!\n";
}

// Display the event menu
void eventMenu(int currentRollNo)
{
    loadEvents();

    int choice;

    do
    {
        cout << "\n===== COLLEGE EVENTS =====\n";
        cout << "1. Add Event\n";
        cout << "2. Display All Events\n";
        cout << "3. Search Event\n";
        cout << "4. Register for Event\n";
        cout << "5. Display Upcoming Events\n";
        cout << "6. Back to Main Menu\n";
        cout << "Enter choice: ";

        if (!(cin >> choice))
        {
            cout << "Please enter a valid number.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue;
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        switch (choice)
        {
            case 1:
                addEvent();
                break;

            case 2:
                displayEvents(currentRollNo);
                break;

            case 3:
                searchEvent(currentRollNo);
                break;

            case 4:
                registerEvent(currentRollNo);
                break;

            case 5:
                displayUpcomingEvents(currentRollNo);
                break;

            case 6:
                cout << "Returning to main menu...\n";
                break;

            default:
                cout << "Invalid choice. Try again.\n";
        }

    } while (choice != 6);
}