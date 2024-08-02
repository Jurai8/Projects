#include <iostream>
using namespace std;

void startFromLight();
void startFromDark();

int main() {
    char userInput;

    std::cout << "would you like to begin? Y/N " << std::endl;
    cin >> userInput;

    if (userInput == 'Y') {
        for (int i = 1; i < 9; i++) {
            // if even 
            if (i % 2 == 0) {
                // print starting from light square
                startFromLight();
            } else {
                // print starting from dark square
                startFromDark();
            }

            cout << "\n";
        }
    } else {
        return 0;
    }
} 

// create two functions
    // 1. starts printing from light square
void startFromLight() {
    for (int j = 1; j < 9; j++) {
        // if it's even
        if (j % 2 == 0) {
            // print dark square
            cout << "O";
        } else {
            // print light square
            cout << "#";
        }
    }
}
    // 2. starts printing from dark square
void startFromDark() {
    for (int j = 1; j < 9; j++) {
        // if it's even
        if (j % 2 == 0) {
            // print dark square
            cout << "#";
        } else {
            // print light square
            cout << "O";
        }
    }
}


