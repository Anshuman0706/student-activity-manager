#include <stdio.h>
#include "task.h"

Task tasks[100];
int taskCount = 0;

/* Save all tasks into file */
void saveTasks()
{
    FILE *file = fopen("data/tasks.txt", "w");

    if (file == NULL)
    {
        printf("\nError: Could not open tasks.txt\n");
        return;
    }

    for (int i = 0; i < taskCount; i++)
    {
        fprintf(file, "%d|%s|%d|%d\n",
                tasks[i].id,
                tasks[i].title,
                tasks[i].daysLeft,
                tasks[i].priority);
    }

    fclose(file);
}

/* Load tasks from file */
void loadTasks()
{
    FILE *file = fopen("data/tasks.txt", "r");

    if (file == NULL)
    {
        return;
    }

    taskCount = 0;

    while (taskCount < 100)
    {
        int result = fscanf(file, "%d|%99[^|]|%d|%d\n",
                            &tasks[taskCount].id,
                            tasks[taskCount].title,
                            &tasks[taskCount].daysLeft,
                            &tasks[taskCount].priority);

        if (result != 4)
        {
            break;
        }

        taskCount++;
    }

    fclose(file);
}

/* Add a new task */
void addTask()
{
    Task newTask;

    if (taskCount >= 100)
    {
        printf("\nTask limit reached!\n");
        return;
    }

    newTask.id = taskCount + 1;

    printf("\nEnter Task Title: ");
    scanf(" %[^\n]", newTask.title);

    printf("Enter Days Left: ");
    scanf("%d", &newTask.daysLeft);

    /* Calculate priority */
    if (newTask.daysLeft <= 1)
    {
        newTask.priority = 3;      /* HIGH */
    }
    else if (newTask.daysLeft <= 5)
    {
        newTask.priority = 2;      /* MEDIUM */
    }
    else
    {
        newTask.priority = 1;      /* LOW */
    }

    tasks[taskCount] = newTask;
    taskCount++;

    /* Arrange tasks according to priority */
    for (int i = taskCount - 1; i > 0; i--)
    {
        if (tasks[i].priority > tasks[i - 1].priority)
        {
            Task temp = tasks[i];

            tasks[i] = tasks[i - 1];

            tasks[i - 1] = temp;
        }
        else
        {
            break;
        }
    }

    saveTasks();

    printf("\nTask added and saved successfully!\n");
}

/* Display tasks */
void displayTasks()
{
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
        printf("\nTask ID   : %d", tasks[i].id);
        printf("\nTitle     : %s", tasks[i].title);
        printf("\nDays Left : %d", tasks[i].daysLeft);

        printf("\nPriority  : ");

        if (tasks[i].priority == 3)
        {
            printf("HIGH");
        }
        else if (tasks[i].priority == 2)
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