#ifndef STUDENT_H
#define STUDENT_H

#include <string>
using namespace std;

class Student
{
private:
    string name;
    string password;
    string branch;
    int rollNo;
    int semester;

public:
    void newUser();
    bool login();
    void display();

    string getName();
    int getRollNo();
    string getBranch();
    int getSemester();
};

#endif