#include <iostream>
#include "student.h"

using namespace std;

void Student::input()
{
    cout << "\nEnter Student Name: ";
    cin >> name;

    cout << "Enter Roll Number: ";
    cin >> rollNo;

    cout << "Enter Branch: ";
    cin >> branch;

    cout << "Enter Semester: ";
    cin >> semester;
}

void Student::display()
{
    cout << "\n===== STUDENT PROFILE =====\n";
    cout << "Name     : " << name << endl;
    cout << "Roll No  : " << rollNo << endl;
    cout << "Branch   : " << branch << endl;
    cout << "Semester : " << semester << endl;
}