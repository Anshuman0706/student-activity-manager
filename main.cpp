#include <iostream>
#include "student.h"
#include "exam.h"
using namespace std;
extern "C"
{
    #include "task.h"
}


int main()
{
    int choice;
    Student student;
    Exam exam;
    loadTasks();

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
        cin >> choice;

        switch (choice)
        {
            case 1:
                student.input();
                student.display();
                break;

            case 2:
            {
                int taskChoice;

                do
                {
                    cout << "\n========== TASK MANAGER ==========\n";
                    cout << "1. Add Task\n";
                    cout << "2. Display Tasks\n";
                    cout << "3. Back to Main Menu\n";

                    cout << "\nEnter your choice: ";
                    cin >> taskChoice;

                    switch (taskChoice)
                    {
                        case 1:
                            addTask();
                            break;

                        case 2:
                            displayTasks();
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

            case 3:
                exam.input();
                exam.display();
                break;

            case 4:
                cout << "\nAttendance Tracker selected.\n";
                break;

            case 5:
                cout << "\nLibrary Manager selected.\n";
                break;

            case 6:
                cout << "\nCollege Events selected.\n";
                break;

            case 7:
                cout << "\nPlacement Opportunities selected.\n";
                break;

            case 8:
                cout << "\nThank you for using Smart Student Life Assistant!\n";
                break;

            default:
                cout << "\nInvalid choice. Please try again.\n";
        }

    } while (choice != 8);

    return 0;
}