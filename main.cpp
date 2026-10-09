
#include <iostream>
#include "student.h"
#include "exam.h"
#include "attendance.h"

using namespace std;

extern "C"
{
    #include "task.h"
}

int main()
{
    int choice;
    int currentRollNo = 0;

    Student student;
    Exam exam;

    do
    {
        cout << "\n=====================================\n";
        cout << "     SMART STUDENT LIFE ASSISTANT\n";
        cout << "=====================================\n";
        cout << "1. Student Profile\n";
        cout << "2. Task / Assignment Manager\n";
        cout << "3. Exam Planner\n";
        cout << "4. Attendance Tracker\n";
        cout << "5. Library Manager\n";
        cout << "6. College Events\n";
        cout << "7. Placement Opportunities\n";
        cout << "8. Exit\n";
        cout << "\nEnter your choice: ";

        if (!(cin >> choice))
        {
            cout << "\nPlease enter a valid number.\n";
            cin.clear();
            cin.ignore(10000, '\n');
            continue;
        }

        switch (choice)
        {
            // ==========================================
            // 1. STUDENT PROFILE
            // ==========================================
            case 1:
            {
                int studentChoice;

                do
                {
                    cout << "\n=====================================\n";
                    cout << "          STUDENT PROFILE\n";
                    cout << "=====================================\n";
                    cout << "1. New User\n";
                    cout << "2. Existing User\n";
                    cout << "3. Back\n";
                    cout << "\nEnter your choice: ";

                    if (!(cin >> studentChoice))
                    {
                        cout << "Please enter a valid number.\n";
                        cin.clear();
                        cin.ignore(10000, '\n');
                        continue;
                    }

                    switch (studentChoice)
                    {
                        case 1:
                            student.newUser();
                            break;

                        case 2:
                            if (student.login())
                            {
                                currentRollNo = student.getRollNo();

                                cout << "\nLogin Successful!";
                                cout << "\nLogged-in Roll Number: "
                                     << currentRollNo;
                                cout << "\nReturning to Main Menu...\n";

                                studentChoice = 3;
                            }
                            break;

                        case 3:
                            cout << "\nReturning to Main Menu...\n";
                            break;

                        default:
                            cout << "\nInvalid choice.\n";
                    }

                } while (studentChoice != 3);

                break;
            }

            // ==========================================
            // 2. TASK / ASSIGNMENT MANAGER
            // ==========================================
            case 2:
            {
                if (currentRollNo == 0)
                {
                    cout << "\nPlease login first to use Task Manager.\n";
                    break;
                }

                int taskChoice;

                do
                {
                    cout << "\n=====================================\n";
                    cout << "          TASK MANAGER\n";
                    cout << "=====================================\n";
                    cout << "1. Add Task\n";
                    cout << "2. Display Tasks\n";
                    cout << "3. Back to Main Menu\n";
                    cout << "\nEnter your choice: ";

                    if (!(cin >> taskChoice))
                    {
                        cout << "Please enter a valid number.\n";
                        cin.clear();
                        cin.ignore(10000, '\n');
                        continue;
                    }

                    switch (taskChoice)
                    {
                        case 1:
                            addTask(currentRollNo);
                            break;

                        case 2:
                            displayTasks(currentRollNo);
                            break;

                        case 3:
                            cout << "\nReturning to Main Menu...\n";
                            break;

                        default:
                            cout << "\nInvalid choice.\n";
                    }

                } while (taskChoice != 3);

                break;
            }

            // ==========================================
            // 3. EXAM PLANNER
            // ==========================================
            case 3:
                exam.input();
                exam.display();
                break;

            // ==========================================
            // 4. ATTENDANCE TRACKER
            // ==========================================
            case 4:
                if (currentRollNo == 0)
                {
                    cout << "\nPlease login first to use Attendance Tracker.\n";
                    break;
                }

                attendanceMenu();
                break;

            // ==========================================
            // 5. LIBRARY MANAGER
            // ==========================================
            case 5:
                cout << "\nLibrary Manager selected.\n";
                break;

            // ==========================================
            // 6. COLLEGE EVENTS
            // ==========================================
            case 6:
                cout << "\nCollege Events selected.\n";
                break;

            // ==========================================
            // 7. PLACEMENT OPPORTUNITIES
            // ==========================================
            case 7:
                cout << "\nPlacement Opportunities selected.\n";
                break;

            // ==========================================
            // 8. EXIT
            // ==========================================
            case 8:
                cout << "\nThank you for using Smart Student Life Assistant!\n";
                break;

            default:
                cout << "\nInvalid choice. Please try again.\n";
        }

    } while (choice != 8);

    return 0;
}