#ifndef EXAM_H
#define EXAM_H

#include <string>
using namespace std;

class Exam
{
private:
    string subject;
    int daysLeft;

public:
    void input();
    void display();
};

#endif