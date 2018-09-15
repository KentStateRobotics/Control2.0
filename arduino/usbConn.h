//usbConn
//Kent State Univeristy - RMC team
//
//
//Implements a serial connection with flag bytes and identifer
#ifndef RMC_ARDUINO_USBCONN_H_
#define RMC_ARDUINO_USBCONN_H_

#include <Arduino.h>

class usbConn{
    public:
        usbConn() : usbConn(100) {};
        usbConn(int bufferSize, char id){
            this->id = id;
            this->bufferSize = bufferSize;
            this->buffer = new char[bufferSize];
        };
        ~usbConn(){
            Serial.flush();
            Serial.end();
            delete[] buffer;
        };
        void start(int baud); //Starts serial connection
        void start(){ start(19200); };
        //Write message to serial with flags and checksum
        //escape: automaticly escape all flag bytes
        void write(const char* message, int length, bool escape = true); 
        void write(String message, bool escape = true);
        int readLoop(); //Run this on each iteration of loop, returns how many bytes to read out of buffer
        //if it returns 0 pass
        const char* getBuffer() { return buffer; }; //Get the buffer
    private:
        const char CON_CHAR = '<';
        const char END_CHAR = '>';
        int bufferSize;
        char* buffer = 0;
        int bufferLoc = 0;
        unsigned long timer = 0;
        int timeout = 1000;
        char id = '0';
        enum class readState{notReading, readCon, reading};
        readState state = readState::notReading;
};

#endif