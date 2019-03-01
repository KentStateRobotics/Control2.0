z#define START '|'
#define END  '~'
#define ID 1

String Msg = "";
String msgIn = "";
bool newMsg = false;

void setup() {
  Serial.begin(115200);
  Serial.print(ID);
  pinMode(13, OUTPUT);
}

void loop() {
  newMsg = recieveMsg();
  if (newMsg) {
    sendMsg(newMsg);
  }
}

void sendMsg(String msg) {
  Serial.println(msg);
}

bool recieveMsg(){
  if(Serial.read() != START){
    int counter = 0;
    while(Serial.read() != END){
      counter++;
      if(counter >= 100){
        continue;
      }
    }
    return false;
  }
  int counter = 0;
  while(Serial.peek() != END){
    if(Serial.available() > 0){
      msgIn.concat(Serial.read());
    }
    counter++;
    if(counter >= 1000){
      return false;
    }
  }
  Serial.read();
  return true;
}
