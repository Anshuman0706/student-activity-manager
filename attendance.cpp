#include "attendance.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <limits>
#include <string>

using namespace std;

struct Attendance
{
    int rollNo;
    string subject;
    int attended;
    int total;
};

Attendance records[500];
int countRecords = 0;

const char *ATTENDANCE_FILE_NAME = "data/attendance.txt";
// Load attendance records from file
void loadAttendance()
{
    countRecords = 0;

    ifstream file(ATTENDANCE_FILE_NAME);
    string line;

    while (getline(file, line) && countRecords < 500)
    {
        stringstream ss(line);
        string roll, subject, attended, total;

        if (getline(ss, roll, '|') &&
            getline(ss, subject, '|') &&
            getline(ss, attended, '|') &&
            getline(ss, total, '|'))
        {
            try
            {
                Attendance a;
                a.rollNo = stoi(roll);
                a.subject = subject;
                a.attended = stoi(attended);
                a.total = stoi(total);

                if (a.rollNo > 0 && !a.subject.empty() &&
                    a.attended >= 0 && a.total >= a.attended)
                {
                    records[countRecords++] = a;
                }
            }
            catch (...)
            {
                // Ignore malformed records
            }
        }
    }
}

// Save all attendance records
void saveAttendance()
{
    ofstream file(ATTENDANCE_FILE_NAME);

    if (!file)
    {
        cout << "Error: Could not open attendance file.\n";
        cout << "Make sure the data folder exists.\n";
        return;
    }

    for (int i = 0; i < countRecords; i++)
    {
        file << records[i].rollNo << "|"
             << records[i].subject << "|"
             << records[i].attended << "|"
             << records[i].total << "\n";
    }

    file.close();
}

// Find a record using roll number and subject
int findAttendance(int rollNo, string subject)
{
    for (int i = 0; i < countRecords; i++)
    {
        if (records[i].rollNo == rollNo &&
            records[i].subject == subject)
        {
            return i;
        }
    }

    return -1;
}

// Display one record
void displayRecord(int i)
{
    double percentage =
        (records[i].total == 0)
        ? 0.0
        : (double)records[i].attended /
          records[i].total * 100.0;

    cout << "\nRoll Number: " << records[i].rollNo;
    cout << "\nSubject: " << records[i].subject;
    cout << "\nClasses Attended: " << records[i].attended;
    cout << "\nTotal Classes: " << records[i].total;
    cout << fixed << setprecision(2);
    cout << "\nAttendance: " << percentage << "%";
    cout << "\nStatus: "
         << (percentage >= 75.0 ? "Meets 75% threshold"
                                : "Below 75% threshold");
    cout << "\n-----------------------------\n";
}

// Add a new attendance record
void addAttendance()
{
    if (countRecords >= 500)
    {
        cout << "Attendance record limit reached.\n";
        return;
    }

    Attendance a;

    cout << "Enter student roll number: ";
    if (!(cin >> a.rollNo) || a.rollNo <= 0)
    {
        cout << "Invalid roll number.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    cout << "Enter subject name: ";
    getline(cin, a.subject);

    if (a.subject.empty() || a.subject.find('|') != string::npos)
    {
        cout << "Invalid subject name.\n";
        return;
    }

    if (findAttendance(a.rollNo, a.subject) != -1)
    {
        cout << "This attendance record already exists.\n";
        cout << "Choose Update Attendance instead.\n";
        return;
    }

    cout << "Enter total classes held: ";
    if (!(cin >> a.total) || a.total < 1)
    {
        cout << "Total classes must be at least 1.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cout << "Enter classes attended: ";
    if (!(cin >> a.attended) ||
        a.attended < 0 || a.attended > a.total)
    {
        cout << "Invalid number of classes attended.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    records[countRecords++] = a;
    saveAttendance();

    cout << "Attendance record added.\n";
}

// Update an existing record
void updateAttendance()
{
    int rollNo;
    string subject;

    cout << "Enter student roll number: ";
    if (!(cin >> rollNo) || rollNo <= 0)
    {
        cout << "Invalid roll number.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    cout << "Enter subject name: ";
    getline(cin, subject);

    int index = findAttendance(rollNo, subject);

    if (index == -1)
    {
        cout << "Attendance record not found.\n";
        return;
    }

    int total, attended;

    cout << "Enter updated total classes: ";
    if (!(cin >> total) || total < 1)
    {
        cout << "Invalid total classes.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cout << "Enter updated classes attended: ";
    if (!(cin >> attended) || attended < 0 || attended > total)
    {
        cout << "Invalid classes attended.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    records[index].total = total;
    records[index].attended = attended;

    saveAttendance();
    cout << "Attendance updated successfully.\n";
}

// Display all attendance records
void displayAttendance()
{
    if (countRecords == 0)
    {
        cout << "No attendance records found.\n";
        return;
    }

    for (int i = 0; i < countRecords; i++)
    {
        displayRecord(i);
    }
}

// Search by student roll number
void searchAttendance()
{
    int rollNo;
    bool found = false;

    cout << "Enter student roll number: ";
    if (!(cin >> rollNo) || rollNo <= 0)
    {
        cout << "Invalid roll number.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int i = 0; i < countRecords; i++)
    {
        if (records[i].rollNo == rollNo)
        {
            displayRecord(i);
            found = true;
        }
    }

    if (!found)
    {
        cout << "No attendance records found for this roll number.\n";
    }
}

// Attendance module menu
void attendanceMenu()
{
    loadAttendance();

    int choice;

    do
    {
        cout << "\n===== ATTENDANCE TRACKER =====\n";
        cout << "1. Add Attendance\n";
        cout << "2. Update Attendance\n";
        cout << "3. Display All Attendance\n";
        cout << "4. Search Attendance by Roll Number\n";
        cout << "5. Back to Main Menu\n";
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
                addAttendance();
                break;

            case 2:
                updateAttendance();
                break;

            case 3:
                displayAttendance();
                break;

            case 4:
                searchAttendance();
                break;

            case 5:
                cout << "Returning to main menu...\n";
                break;

            default:
                cout << "Invalid choice. Try again.\n";
        }

    } while (choice != 5);
}