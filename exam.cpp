#include <iostream>
#include "exam.h"

using namespace std;

void Exam::input()
{
    cout << "\nEnter Subject Name: ";
    cin >> subject;

    cout << "Enter Days Left for Exam: ";
    cin >> daysLeft;
}

void Exam::display()
{
    cout << "\n========== EXAM DETAILS ==========\n";

    cout << "Subject   : " << subject << endl;
    cout << "Days Left : " << daysLeft << endl;

    cout << "Priority  : ";

    if (daysLeft <= 1)
    {
        cout << "HIGH";
    }
    else if (daysLeft <= 5)
    {
        cout << "MEDIUM";
    }
    else
    {
        cout << "LOW";
    }

    cout << endl;
}