
const int ledPin = 13;
int valCurrent = 0;
int valPast = 0;
int valToSend = 0;

int SENSOR_THRESHOLD = 5; // sensor over 5 units
int TIME_THRESHOLD = 100;  // send 10 times per second
int FAILSAFE_THRESHOLD = 100; // tap max 3 times per second, you are not superman

long timer = 0;
long timerFailSafe = 0;

boolean readData = true;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);

  timer = millis();
}

void loop() {
  // put your main code here, to run repeatedly:
  if (readData)
    valCurrent = analogRead(A0);

  if (valCurrent < valPast) {
    valToSend = valPast;
    readData = false;
    timerFailSafe = millis();
  }

  if (valPast < SENSOR_THRESHOLD) {
    valToSend = 0;
  }

  if (millis() - timer > TIME_THRESHOLD) {
    Serial.println(valToSend);
    timer = millis();
  }

  if (millis() - timerFailSafe > FAILSAFE_THRESHOLD) {
    readData = true;
  }

  if (valCurrent > SENSOR_THRESHOLD) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }

  valPast = valCurrent;

}

