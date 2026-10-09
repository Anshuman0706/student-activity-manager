#include <iostream>
#include <fstream>
#include "student.h"

using namespace std;

void Student::newUser()
{
    cout << "\n========== NEW USER ==========\n";

    cout << "\nEnter Name     : ";
    cin >> name;

    cout << "Enter Password : ";
    cin >> password;

    cout << "Enter Branch   : ";
    cin >> branch;

    cout << "Enter Semester : ";
    cin >> semester;

    // Automatically assign Roll No
    rollNo = 101;

    ifstream checkFile("data/students.txt");

    int existingRoll;
    string existingName;
    string existingPassword;
    string existingBranch;
    int existingSemester;

    while (checkFile >> existingRoll
                     >> existingName
                     >> existingPassword
                     >> existingBranch
                     >> existingSemester)
    {
        if (existingRoll >= rollNo)
        {
            rollNo = existingRoll + 1;
        }
    }

    checkFile.close();

    ofstream file("data/students.txt", ios::app);

    if (file.is_open())
    {
        file << rollNo << " "
             << name << " "
             << password << " "
             << branch << " "
             << semester << endl;

        file.close();

        cout << "\nAccount created successfully!\n";
        cout << "Your Roll No: " << rollNo << endl;
    }
    else
    {
        cout << "\nError: Could not save student data.\n";
    }
}

bool Student::login()
{
    string inputName;
    string inputPassword;

    cout << "\n========== EXISTING USER ==========\n";

    cout << "\nEnter Name     : ";
    cin >> inputName;

    cout << "Enter Password : ";
    cin >> inputPassword;

    ifstream file("data/students.txt");

    if (!file.is_open())
    {
        cout << "\nNo student accounts found.\n";
        return false;
    }

    int savedRoll;
    string savedName;
    string savedPassword;
    string savedBranch;
    int savedSemester;

    while (file >> savedRoll
                >> savedName
                >> savedPassword
                >> savedBranch
                >> savedSemester)
    {
        if (savedName == inputName &&
            savedPassword == inputPassword)
        {
            rollNo = savedRoll;
            name = savedName;
            password = savedPassword;
            branch = savedBranch;
            semester = savedSemester;

            file.close();

            cout << "\nLogin Successful!\n";
            cout << "\nWelcome " << name << endl;
            cout << "Roll No  : " << rollNo << endl;
            cout << "Branch   : " << branch << endl;
            cout << "Semester : " << semester << endl;

            return true;
        }
    }

    file.close();

    cout << "\nInvalid name or password.\n";

    return false;
}

void Student::display()
{
    cout << "\n===== STUDENT PROFILE =====\n";
    cout << "Name     : " << name << endl;
    cout << "Roll No  : " << rollNo << endl;
    cout << "Branch   : " << branch << endl;
    cout << "Semester : " << semester << endl;
}

string Student::getName()
{
    return name;
}

int Student::getRollNo()
{
    return rollNo;
}

string Student::getBranch()
{
    return branch;
}

int Student::getSemester()
{
    return semester;
}