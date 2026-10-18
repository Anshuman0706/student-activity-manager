#ifndef TASK_H
#define TASK_H

typedef struct
{
    int id;
    char title[100];

    int day;
    int month;
    int year;

    int priority;
} Task;

void addTask(int rollNo);
void displayTasks(int rollNo);
void saveTasks(int rollNo);
void loadTasks(int rollNo);

#endif