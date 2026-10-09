#include "library.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <limits>

using namespace std;

struct Book
{
    int id;
    string title;
    string author;
    int issued;
    int issuedRollNo;
};

Book books[500];
int bookCount = 0;

const char *FILE_NAME = "data/books.txt";

// Load saved books
void loadBooks()
{
    bookCount = 0;

    ifstream file(FILE_NAME);
    string line;

    while (getline(file, line) && bookCount < 500)
    {
        stringstream ss(line);
        string id, title, author, issued, roll;

        if (getline(ss, id, '|') &&
            getline(ss, title, '|') &&
            getline(ss, author, '|') &&
            getline(ss, issued, '|') &&
            getline(ss, roll, '|'))
        {
            try
            {
                books[bookCount].id = stoi(id);
                books[bookCount].title = title;
                books[bookCount].author = author;
                books[bookCount].issued = stoi(issued);
                books[bookCount].issuedRollNo = stoi(roll);

                bookCount++;
            }
            catch (...)
            {
                // Ignore an invalid file record
            }
        }
    }
}

// Save books to file
void saveBooks()
{
    ofstream file(FILE_NAME);

    if (!file)
    {
        cout << "Could not open data/books.txt\n";
        cout << "Make sure the data folder exists.\n";
        return;
    }

    for (int i = 0; i < bookCount; i++)
    {
        file << books[i].id << "|"
             << books[i].title << "|"
             << books[i].author << "|"
             << books[i].issued << "|"
             << books[i].issuedRollNo << "\n";
    }
}

// Find a book using its ID
int findBook(int id)
{
    for (int i = 0; i < bookCount; i++)
    {
        if (books[i].id == id)
            return i;
    }

    return -1;
}

// Add a book
void addBook()
{
    if (bookCount >= 500)
    {
        cout << "Book storage is full.\n";
        return;
    }

    Book b;

    cout << "Enter book ID: ";

    if (!(cin >> b.id) || b.id <= 0)
    {
        cout << "Invalid book ID.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    if (findBook(b.id) != -1)
    {
        cout << "This book ID already exists.\n";
        return;
    }

    cout << "Enter book title: ";
    getline(cin, b.title);

    cout << "Enter author name: ";
    getline(cin, b.author);

    if (b.title.empty() || b.author.empty() ||
        b.title.find('|') != string::npos ||
        b.author.find('|') != string::npos)
    {
        cout << "Invalid title or author name.\n";
        return;
    }

    b.issued = 0;
    b.issuedRollNo = 0;

    books[bookCount++] = b;

    saveBooks();

    cout << "Book added successfully.\n";
}

// Display all books
void displayBooks()
{
    if (bookCount == 0)
    {
        cout << "No books available in the library.\n";
        return;
    }

    cout << "\n===== BOOK LIST =====\n";

    for (int i = 0; i < bookCount; i++)
    {
        cout << "\nBook ID: " << books[i].id;
        cout << "\nTitle: " << books[i].title;
        cout << "\nAuthor: " << books[i].author;

        if (books[i].issued == 0)
            cout << "\nStatus: Available\n";
        else
            cout << "\nStatus: Issued\n";

        cout << "----------------------\n";
    }
}

// Search by ID or title
void searchBook()
{
    int choice;
    bool found = false;

    cout << "1. Search by ID\n";
    cout << "2. Search by title\n";
    cout << "Enter choice: ";

    if (!(cin >> choice))
    {
        cout << "Invalid choice.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    if (choice == 1)
    {
        int id;

        cout << "Enter book ID: ";

        if (!(cin >> id))
        {
            cout << "Invalid ID.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            return;
        }

        int index = findBook(id);

        if (index != -1)
        {
            cout << "\nTitle: " << books[index].title;
            cout << "\nAuthor: " << books[index].author;
            cout << "\nStatus: "
                 << (books[index].issued ? "Issued" : "Available")
                 << "\n";

            found = true;
        }
    }
    else if (choice == 2)
    {
        string title;

        cout << "Enter book title: ";
        getline(cin, title);

        for (int i = 0; i < bookCount; i++)
        {
            if (books[i].title == title)
            {
                cout << "\nBook ID: " << books[i].id;
                cout << "\nTitle: " << books[i].title;
                cout << "\nAuthor: " << books[i].author;
                cout << "\nStatus: "
                     << (books[i].issued ? "Issued" : "Available")
                     << "\n";

                found = true;
            }
        }
    }
    else
    {
        cout << "Invalid choice.\n";
        return;
    }

    if (!found)
        cout << "Book not found.\n";
}

// Issue a book to the logged-in student
void issueBook(int currentRollNo)
{
    int id;

    cout << "Enter book ID to issue: ";

    if (!(cin >> id))
    {
        cout << "Invalid ID.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    int index = findBook(id);

    if (index == -1)
    {
        cout << "Book not found.\n";
        return;
    }

    if (books[index].issued == 1)
    {
        cout << "This book is already issued.\n";
        return;
    }

    books[index].issued = 1;
    books[index].issuedRollNo = currentRollNo;

    saveBooks();

    cout << "Book issued successfully to roll number "
         << currentRollNo << ".\n";
}

// Return a book issued to the logged-in student
void returnBook(int currentRollNo)
{
    int id;

    cout << "Enter book ID to return: ";

    if (!(cin >> id))
    {
        cout << "Invalid ID.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        return;
    }

    int index = findBook(id);

    if (index == -1)
    {
        cout << "Book not found.\n";
        return;
    }

    if (books[index].issued == 0)
    {
        cout << "This book is already available.\n";
        return;
    }

    if (books[index].issuedRollNo != currentRollNo)
    {
        cout << "This book was issued to another student.\n";
        return;
    }

    books[index].issued = 0;
    books[index].issuedRollNo = 0;

    saveBooks();

    cout << "Book returned successfully.\n";
}

// Main library menu
void libraryMenu(int currentRollNo)
{
    loadBooks();

    int choice;

    do
    {
        cout << "\n===== LIBRARY MANAGER =====\n";
        cout << "1. Add Book\n";
        cout << "2. Display Books\n";
        cout << "3. Search Book\n";
        cout << "4. Issue Book\n";
        cout << "5. Return Book\n";
        cout << "6. Back to Main Menu\n";
        cout << "Enter choice: ";

        if (!(cin >> choice))
        {
            cout << "Please enter a valid number.\n";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue;
        }

        switch (choice)
        {
            case 1:
                addBook();
                break;

            case 2:
                displayBooks();
                break;

            case 3:
                searchBook();
                break;

            case 4:
                issueBook(currentRollNo);
                break;

            case 5:
                returnBook(currentRollNo);
                break;

            case 6:
                cout << "Returning to main menu...\n";
                break;

            default:
                cout << "Invalid choice.\n";
        }

    } while (choice != 6);
}