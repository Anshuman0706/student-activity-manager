
#include <iostream>
#include <limits>

#include "student.h"
#include "exam.h"
#include "attendance.h"
#include "library.h"
#include "event.h"

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
        cout << "\n========================================\n";
        cout << "       SMART STUDENT LIFE ASSISTANT\n";
        cout << "========================================\n";
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

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        switch (choice)
        {
            // STUDENT PROFILE
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
                        cin.ignore(
                            numeric_limits<streamsize>::max(), '\n'
                        );
                        studentChoice = 0;
                        continue;
                    }

                    cin.ignore(
                        numeric_limits<streamsize>::max(), '\n'
                    );

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
                            else
                            {
                                cout << "Login failed. Please try again.\n";
                            }
                            break;

                        case 3:
                            cout << "Returning to main menu...\n";
                            break;

                        default:
                            cout << "Invalid choice.\n";
                    }

                } while (studentChoice != 3);

                break;
            }

            // TASK / ASSIGNMENT MANAGER
            case 2:
            {
                if (currentRollNo == 0)
                {
                    cout << "Please login first to access Tasks.\n";
                    break;
                }

                int taskChoice;

                do
                {
                    cout << "\n===== TASK MANAGER =====\n";
                    cout << "1. Add Task\n";
                    cout << "2. Display Tasks\n";
                    cout << "3. Back to Main Menu\n";
                    cout << "\nEnter your choice: ";

                    if (!(cin >> taskChoice))
                    {
                        cout << "Please enter a valid number.\n";
                        cin.clear();
                        cin.ignore(
                            numeric_limits<streamsize>::max(), '\n'
                        );
                        taskChoice = 0;
                        continue;
                    }

                    cin.ignore(
                        numeric_limits<streamsize>::max(), '\n'
                    );

                    switch (taskChoice)
                    {
                        case 1:
                            addTask(currentRollNo);
                            break;

                        case 2:
                            displayTasks(currentRollNo);
                            break;

                        case 3:
                            cout << "Returning to main menu...\n";
                            break;

                        default:
                            cout << "Invalid choice.\n";
                    }

                } while (taskChoice != 3);

                break;
            }

            // EXAM PLANNER
            case 3:
                exam.input();
                exam.display();
                break;

            // ATTENDANCE TRACKER
            case 4:
                if (currentRollNo == 0)
                {
                    cout << "\nPlease login first to use Attendance Tracker.\n";
                    break;
                }

                attendanceMenu();
                break;
            }

            // LIBRARY MANAGER
            case 5:
            {
                if (currentRollNo == 0)
                {
                    cout << "Please login first to access the Library.\n";
                }
                else
                {
                    libraryMenu(currentRollNo);
                }

                break;
            }

            // COLLEGE EVENTS
            case 6:
            {
                if (currentRollNo == 0)
                {
                    cout << "Please login first to access College Events.\n";
                }
                else
                {
                    eventMenu(currentRollNo);
                }

                break;
            }

            // PLACEMENT OPPORTUNITIES
            case 7:
                cout << "Placement module is not connected yet.\n";
                break;

            // EXIT
            case 8:
                cout << "\nThank you for using Smart Student Life Assistant!\n";
                break;

            default:
                cout << "Invalid choice. Please try again.\n";
        }

    } while (choice != 8);

    return 0;
}
