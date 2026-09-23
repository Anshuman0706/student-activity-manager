#ifndef STUDENT_H
#define STUDENT_H

#include <string>
using namespace std;

class Student
{
private:
    string name;
    string branch;
    int rollNo;
    int semester;

public:
    void input();
    void display();
};

#endif