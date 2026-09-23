#ifndef TASK_H
#define TASK_H

typedef struct
{
    int id;
    char title[100];
    int daysLeft;
    int priority;
} Task;

void addTask();
void displayTasks();
void saveTasks();
void loadTasks();

#endif