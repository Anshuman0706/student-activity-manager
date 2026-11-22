#include "placement.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <limits>
#include <ctime>

using namespace std;

struct Placement
{
    int id;
    string company;
    string role;
    string eligibility;
    string deadline;
    string packageDetails;
    int interestedRolls[100];
    int interestCount;
};

Placement placements[200];
int placementCount = 0;

const char *PLACEMENT_FILE = "data/placements.txt";

string getCurrentDate()
{
    time_t now = time(0);
    tm *current = localtime(&now);

    char date[11];
    strftime(date, sizeof(date), "%Y-%m-%d", current);

    return string(date);
}

bool validPlacementField(string value)
{
    return !value.empty() &&
           value.find('|') == string::npos &&
           value.find('\n') == string::npos &&
           value.find('\r') == string::npos;
}

bool validDate(string date)
{
    if (date.length() != 10 ||
        date[4] != '-' || date[7] != '-')
        return false;

    for (int i = 0; i < 10; i++)
    {
        if (i == 4 || i == 7)
            continue;

        if (date[i] < '0' || date[i] > '9')
            return false;
    }

    return true;
}

void loadPlacements()
{
    placementCount = 0;

    ifstream file(PLACEMENT_FILE);
    string line;

    while (getline(file, line) && placementCount < 200)
    {
        stringstream ss(line);

        string id, company, role, eligibility;
        string deadline, packageDetails, interested;

        if (getline(ss, id, '|') &&
            getline(ss, company, '|') &&
            getline(ss, role, '|') &&
            getline(ss, eligibility, '|') &&
            getline(ss, deadline, '|') &&
            getline(ss, packageDetails, '|') &&
            getline(ss, interested))
        {
            try
            {
                Placement p;

                p.id = stoi(id);
                p.company = company;
                p.role = role;
                p.eligibility = eligibility;
                p.deadline = deadline;
                p.packageDetails = packageDetails;
                p.interestCount = 0;

                stringstream rs(interested);
                string roll;

                while (getline(rs, roll, ',') &&
                       p.interestCount < 100)
                {
                    if (!roll.empty())
                        p.interestedRolls[p.interestCount++] =
                            stoi(roll);
                }

                placements[placementCount++] = p;
            }
            catch (...)
            {
                // Skip an invalid record.
            }
        }
    }
}

void savePlacements()
{
    ofstream file(PLACEMENT_FILE);

    if (!file)
    {
        cout << "Unable to save placements.\n";
        cout << "Make sure the data folder exists.\n";
        return;
    }

    for (int i = 0; i < placementCount; i++)
    {
        file << placements[i].id << "|"
             << placements[i].company << "|"
             << placements[i].role << "|"
             << placements[i].eligibility << "|"
             << placements[i].deadline << "|"
             << placements[i].packageDetails << "|";

        for (int j = 0; j < placements[i].interestCount; j++)
        {
            if (j > 0)
                file << ",";

            file << placements[i].interestedRolls[j];
        }

        file << "\n";
    }
}

int findPlacement(int id)
{
    for (int i = 0; i < placementCount; i++)
    {
        if (placements[i].id == id)
            return i;
    }

    return -1;
}

void addPlacement()
{
    if (placementCount >= 200)
    {
        cout << "Placement storage is full.\n";
        return;
    }

    Placement p;

    int maxId = 0;

    
    for (int i = 0; i < placementCount; i++)
    {
        if (placements[i].id > maxId)
            maxId = placements[i].id;
    }

    p.id = maxId + 1;
    p.interestCount = 0;

    cout << "Enter company name: ";
    getline(cin, p.company);

    cout << "Enter job role: ";
    getline(cin, p.role);

    cout << "Enter eligibility criteria: ";
    getline(cin, p.eligibility);

    cout << "Enter application deadline (YYYY-MM-DD): ";
    getline(cin, p.deadline);

    cout << "Enter package/details: ";
    getline(cin, p.packageDetails);

    if (!validPlacementField(p.company) ||
        !validPlacementField(p.role) ||
        !validPlacementField(p.eligibility) ||
        !validPlacementField(p.deadline) ||
        !validPlacementField(p.packageDetails))
    {
        cout << "Fields cannot be empty or contain '|'.\n";
        return;
    }

    if (!validDate(p.deadline))
    {
        cout << "Invalid date format. Use YYYY-MM-DD.\n";
        return;
    }

    placements[placementCount++] = p;

    savePlacements();

    cout << "Placement added successfully!\n";
    cout << "Placement ID: " << p.id << "\n";
}

void displayOnePlacement(int index, int currentRollNo)
{
    Placement p = placements[index];

    cout << "\n------------------------------------\n";
    cout << "Placement ID: " << p.id << "\n";
    cout << "Company: " << p.company << "\n";
    cout << "Job Role: " << p.role << "\n";
    cout << "Eligibility: " << p.eligibility << "\n";
    cout << "Application Deadline: " << p.deadline << "\n";
    cout << "Package / Details: " << p.packageDetails << "\n";

    bool interested = false;

    for (int i = 0; i < p.interestCount; i++)
    {
        if (p.interestedRolls[i] == currentRollNo)
        {
            interested = true;
            break;
        }
    }

    cout << "Your Interest: "
         << (interested ? "Recorded" : "Not recorded") << "\n";
    cout << "------------------------------------\n";
}

void displayPlacements(int currentRollNo)
{
    if (placementCount == 0)
    {
        cout << "No placement opportunities available.\n";
        return;
    }

    for (int i = 0; i < placementCount; i++)
    {
        displayOnePlacement(i, currentRollNo);
    }
}

void searchPlacement(int currentRollNo)
{
    string keyword;
    bool found = false;

    cout << "Enter company name or job role: ";
    getline(cin, keyword);

    for (int i = 0; i < placementCount; i++)
    {
        if (placements[i].company.find(keyword) != string::npos ||
            placements[i].role.find(keyword) != string::npos)
        {
            displayOnePlacement(i, currentRollNo);
            found = true;
        }
    }

    if (!found)
        cout << "No matching placement found.\n";
}

void displayUpcomingDeadlines(int currentRollNo)
{
    string today = getCurrentDate();
    bool found = false;

    cout << "\nToday's date: " << today << "\n";

    for (int i = 0; i < placementCount; i++)
    {
        if (placements[i].deadline >= today)
        {
            displayOnePlacement(i, currentRollNo);
            found = true;
        }
    }

    if (!found)
        cout << "No upcoming application deadlines found.\n";
}

void recordInterest(int currentRollNo)
{
    int id;

    cout << "Enter Placement ID: ";

    if (!(cin >> id))
    {
        cout << "Invalid Placement ID.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    int index = findPlacement(id);

    if (index == -1)
    {
        cout << "Placement not found.\n";
        return;
    }

    if (placements[index].deadline < getCurrentDate())
    {
        cout << "The application deadline has passed.\n";
        return;
    }

    for (int i = 0; i < placements[index].interestCount; i++)
    {
        if (placements[index].interestedRolls[i] == currentRollNo)
        {
            cout << "Your interest is already recorded.\n";
            return;
        }
    }

    if (placements[index].interestCount >= 100)
    {
        cout << "Interest record limit reached.\n";
        return;
    }

    placements[index].interestedRolls[
        placements[index].interestCount++
    ] = currentRollNo;

    savePlacements();

    cout << "Your interest has been recorded successfully!\n";
}

void placementMenu(int currentRollNo)
{
    loadPlacements();

    int choice;

    do
    {
        cout << "\n===== PLACEMENT OPPORTUNITIES =====\n";
        cout << "1. Add Placement\n";
        cout << "2. Display All Placements\n";
        cout << "3. Search Placement\n";
        cout << "4. Upcoming Deadlines\n";
        cout << "5. Record Interest in Placement\n";
        cout << "6. Back to Main Menu\n";
        cout << "Enter your choice: ";

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
                addPlacement();
                break;

            case 2:
                displayPlacements(currentRollNo);
                break;

            case 3:
                searchPlacement(currentRollNo);
                break;

            case 4:
                displayUpcomingDeadlines(currentRollNo);
                break;

            case 5:
                recordInterest(currentRollNo);
                break;

            case 6:
                cout << "Returning to main menu...\n";
                break;

            default:
                cout << "Invalid choice. Try again.\n";
        }

    } while (choice != 6);
}