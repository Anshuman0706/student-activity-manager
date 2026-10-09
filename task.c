#include <stdio.h>
#include <time.h>
#include "task.h"

Task tasks[100];
int taskCount = 0;

/* Calculate days left automatically */
int calculateDaysLeft(int day, int month, int year)
{
    time_t currentTime = time(NULL);

    struct tm today = *localtime(&currentTime);

    today.tm_hour = 0;
    today.tm_min = 0;
    today.tm_sec = 0;

    struct tm dueDate = {0};

    dueDate.tm_mday = day;
    dueDate.tm_mon = month - 1;
    dueDate.tm_year = year - 1900;

    time_t todayTime = mktime(&today);
    time_t dueTime = mktime(&dueDate);

    double difference = difftime(dueTime, todayTime);

    return (int)(difference / (60 * 60 * 24));
}


/* Load tasks for particular student */
void loadTasks(int rollNo)
{
    char filename[100];

    sprintf(filename, "data/tasks_%d.txt", rollNo);

    FILE *file = fopen(filename, "r");

    taskCount = 0;

    if (file == NULL)
    {
        return;
    }

    while (taskCount < 100)
    {
        int result = fscanf(
            file,
            "%d|%99[^|]|%d|%d|%d|%d\n",
            &tasks[taskCount].id,
            tasks[taskCount].title,
            &tasks[taskCount].day,
            &tasks[taskCount].month,
            &tasks[taskCount].year,
            &tasks[taskCount].priority
        );

        if (result != 6)
        {
            break;
        }

        taskCount++;
    }

    fclose(file);
}


/* Save tasks for particular student */
void saveTasks(int rollNo)
{
    char filename[100];

    sprintf(filename, "data/tasks_%d.txt", rollNo);

    FILE *file = fopen(filename, "w");

    if (file == NULL)
    {
        printf("\nError: Could not save tasks.\n");
        return;
    }

    for (int i = 0; i < taskCount; i++)
    {
        fprintf(
            file,
            "%d|%s|%d|%d|%d|%d\n",
            tasks[i].id,
            tasks[i].title,
            tasks[i].day,
            tasks[i].month,
            tasks[i].year,
            tasks[i].priority
        );
    }

    fclose(file);
}


/* Add task */
void addTask(int rollNo)
{
    Task newTask;

    if (taskCount >= 100)
    {
        printf("\nTask limit reached!\n");
        return;
    }

    newTask.id = taskCount + 1;

    printf("\n========== ADD TASK ==========\n");

    printf("\nEnter Task Title: ");
    scanf(" %[^\n]", newTask.title);

    printf("Enter Due Date (DD MM YYYY): ");
    scanf(
        "%d %d %d",
        &newTask.day,
        &newTask.month,
        &newTask.year
    );

    int daysLeft = calculateDaysLeft(
        newTask.day,
        newTask.month,
        newTask.year
    );

    if (daysLeft <= 1)
    {
        newTask.priority = 3;
    }
    else if (daysLeft <= 5)
    {
        newTask.priority = 2;
    }
    else
    {
        newTask.priority = 1;
    }

    tasks[taskCount] = newTask;
    taskCount++;

    saveTasks(rollNo);

    printf("\nTask added successfully!\n");
}


/* Display tasks */
void displayTasks(int rollNo)
{
    loadTasks(rollNo);

    if (taskCount == 0)
    {
        printf("\nNo tasks available.\n");
        return;
    }

    printf("\n========================================\n");
    printf("          PRIORITY TASK LIST\n");
    printf("========================================\n");

    for (int i = 0; i < taskCount; i++)
    {
        int daysLeft = calculateDaysLeft(
            tasks[i].day,
            tasks[i].month,
            tasks[i].year
        );

        printf("\nTask ID   : %d", tasks[i].id);
        printf("\nTitle     : %s", tasks[i].title);

        printf(
            "\nDue Date  : %02d/%02d/%04d",
            tasks[i].day,
            tasks[i].month,
            tasks[i].year
        );

        printf("\nDays Left : %d", daysLeft);

        printf("\nPriority  : ");

        if (daysLeft <= 1)
        {
            printf("HIGH");
        }
        else if (daysLeft <= 5)
        {
            printf("MEDIUM");
        }
        else
        {
            printf("LOW");
        }

        printf("\n----------------------------------------\n");
    }
}